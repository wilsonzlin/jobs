import cheerio from "cheerio";
import { blk } from "extlib/js/array/gen";
import { assertExists } from "extlib/js/optional/assert";
import { mapDefined } from "extlib/js/optional/map";
import PQueue from "p-queue";
import { Cache, fetch, ParsedJob } from "./_common";

type Subset = {
  results: {
    id: string;
    url: string;
    title: string;
    location: string;
  }[];
  totalCount: number;
};

const RESULTS_PER_PAGE = 100;

const HEADERS = {
  // This is required to avoid server rejection as client error.
  Host: "www.facebook.com",
  // This is required to avoid out-of-date browser notice.
  "User-Agent":
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:76.0) Gecko/20100101 Firefox/76.0",
};

export const fetchDescription = async (
  cache: Cache,
  id: string,
  url: string
): Promise<string> =>
  (await cache.computeIfAbsent<string | undefined>(`job${id}.json`, async () =>
    mapDefined(
      await fetch({
        uri: url,
        headers: HEADERS,
      }),
      (html) => {
        const $ = cheerio.load(html);
        return $("body").text().trim();
      }
    )
  )) ?? "";

export const fetchSubset = async (
  cache: Cache,
  page: number
): Promise<Subset | undefined> =>
  await cache.computeIfAbsent<Subset | undefined>(
    `results${page}.json`,
    async () =>
      mapDefined(
        await fetch({
          uri: `https://www.facebook.com/careers/jobs/`,
          headers: HEADERS,
          qs: { page, results_per_page: RESULTS_PER_PAGE },
        }),
        (html) => {
          const $ = cheerio.load(html);
          const $container = $("#search_result");
          const resultsTitle = $container.find("._8opg").text().trim();
          const totalCount = Number.parseInt(
            /^Find Your New Job \(([\d,]+)\)$/
              .exec(resultsTitle)?.[1]
              .replace(/,/g, "") || "",
            10
          );
          if (!Number.isSafeInteger(totalCount) || totalCount <= 0) {
            throw new Error(
              `Failed to detect total count from title: ${resultsTitle}`
            );
          }
          const subset: Subset = {
            results: [],
            totalCount,
          };
          for (const $resultElem of $container
            .find('a[href^="/careers/jobs"]')
            .get()) {
            const $result = $($resultElem);
            // This attribute definitely exists as it's how we selected this element.
            // Remove any query string from the end.
            const urlPath = assertExists($result.attr("href")).replace(
              /\?[^?]*$/,
              ""
            );
            if (urlPath === "/careers/jobs/") {
              // This is a link to more search results, not a specific job.
              continue;
            }
            const id = assertExists(
              /^\/careers\/jobs\/([0-9]+)\/$/.exec(urlPath)
            )[1];
            const url = `https://www.facebook.com${urlPath}`;
            const title = $result.find("._8sel").text();
            const location = $result.find("_8sen").text();
            subset.results.push({ id, url, title, location });
          }
          return subset;
        }
      )
  );

const DESC_START = "Back to Jobs";
const DESC_END =
  "Facebook's mission is to give people the power to build community and bring the world closer together. Through our family of apps and services, we're building a different kind of company that connects billions of people around the world, gives them ways to share what matters most to them, and helps bring people closer together. Whether we're creating new products or helping a small business expand its reach, people at Facebook are builders at heart.";

const distillDescriptions = (descs: string[]): string[] => {
  return descs.map((d) =>
    d
      .slice(d.indexOf(DESC_START) + DESC_START.length, d.indexOf(DESC_END))
      .trim()
  );
};

export const fetchAll = async (cache: Cache) =>
  cache.computeIfAbsent("raw.json", async () => {
    const queue = new PQueue({ concurrency: 8 });

    // Requesting page zero will cause 500.
    const first = await fetchSubset(cache, 1);
    if (!first) {
      throw new Error(`[Facebook] Failed to fetch first page`);
    }
    const { totalCount } = first;

    console.info(
      `[Facebook] Need to retrieve ${totalCount} jobs in chunks of ${RESULTS_PER_PAGE}`
    );

    const results = await Promise.all(
      blk(Math.ceil(totalCount / RESULTS_PER_PAGE), (page) =>
        queue.add(() => fetchSubset(cache, page + 1))
      )
    );

    const jobs = results.flatMap((result) => result?.results ?? []);

    const fullDescriptions = distillDescriptions(
      await Promise.all(
        jobs.map((j) => queue.add(() => fetchDescription(cache, j.id, j.url)))
      )
    );

    console.log("[Facebook] Jobs successfully fetched");

    return jobs.map((j, i) => ({
      ...j,
      description: fullDescriptions[i],
    }));
  });

export const parseAll = (rawData: any[]): ParsedJob[] => rawData;
