import cheerio from "cheerio";
import { blk } from "extlib/js/array/gen";
import { createDistinctFilter } from "extlib/js/array/members";
import { assertExists } from "extlib/js/optional/assert";
import { mapOptional } from "extlib/js/optional/map";
import moment from "moment";
import PQueue from "p-queue";
import request, { CookieJar } from "request";
import { Job, JobDdo, Results } from "../model/msft";
import {
  Cache,
  fetch,
  formatJobDate,
  getHtmlText,
  ParsedJob,
  QueryParams,
} from "./_common";

const DDO_BEFORE = "phApp.ddo = ";
const DDO_AFTER = "; phApp.experimentData";

// Use `null` for missing data as `undefined` cannot be serialised into JSON.

type Session = {
  cookies: CookieJar;
  csrf: string;
};

export const startSession = async (): Promise<Session> => {
  const cookies = request.jar();
  const body = await fetch({
    uri: "https://careers.microsoft.com/professionals/us/en/search-results",
    cookies,
  });
  const csrf = assertExists(
    /"csrfToken":"([a-fA-F0-9]+)"/.exec(assertExists(body))
  )[1];
  return { cookies, csrf };
};

export const fetchDdo = async <R extends {}>(
  uri: string,
  qs?: QueryParams
): Promise<R | null> =>
  mapOptional(await fetch({ uri, qs }), (body) => {
    const $ = cheerio.load(body);
    for (const $script of $("script").get()) {
      const js = $($script).contents().text();
      const start = js.indexOf(DDO_BEFORE);
      const end = js.indexOf(DDO_AFTER, start);
      if (start != -1 && end != -1) {
        return JSON.parse(
          js.slice(start + DDO_BEFORE.length, js.indexOf(DDO_AFTER, start))
        );
      }
    }
  }) ?? null;

export const fetchWidget = async <R extends {}>(
  body: object,
  session: Session
): Promise<R | null> =>
  mapOptional(
    await fetch({
      method: "POST",
      uri: "https://careers.microsoft.com/professionals/widgets",
      cookies: session.cookies,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": session.csrf,
      },
    }),
    (res) => JSON.parse(res)
  ) ?? null;

export const fetchDescription = async (
  cache: Cache,
  id: string | number
): Promise<string> =>
  mapOptional(
    await cache.computeIfAbsent<Job | null>(
      `job${id}.json`,
      async () =>
        (
          await fetchDdo<JobDdo>(
            `https://careers.microsoft.com/professionals/us/en/job/${id}/`
          )
        )?.jobDetail?.data?.job ?? null
    ),
    (job) =>
      getHtmlText(
        job.description,
        job.jobSummary,
        job.jobResponsibilities,
        job.jobQualifications
      )
  ) ?? "";

export const fetchSubset = async (
  cache: Cache,
  from: number,
  session: Session
): Promise<Results> =>
  await cache.computeIfAbsent<Results>(`results${from}.json`, async () =>
    assertExists(
      await fetchWidget<Results>(
        {
          ddoKey: "refineSearch",
          from,
          jobs: true,
          all_fields: [
            "country",
            "state",
            "city",
            "category",
            "subCategory",
            "employmentType",
            "requisitionRoleType",
          ],
          size: 10000,
          selected_fields: {},
          sortBy: "Most recent",
        },
        session
      )
    )
  );

export const fetchAll = async (cache: Cache) =>
  cache.computeIfAbsent("raw.json", async () => {
    const queue = new PQueue({ concurrency: 8 });

    const session = await startSession();

    const first = await fetchSubset(cache, 0, session);
    const pagination = first.refineSearch.hits;
    const total = first.refineSearch.totalHits;

    console.info(
      `[Microsoft] Need to retrieve ${total} jobs in chunks of ${pagination}`
    );

    const results = await Promise.all(
      blk(Math.ceil(total / pagination), (page) =>
        queue.add(() => fetchSubset(cache, page * pagination, session))
      )
    );

    const jobs = results
      .flatMap((result) => result.refineSearch.data.jobs)
      .filter(createDistinctFilter((j) => j.jobId));

    const fullDescriptions = await Promise.all(
      jobs.map((j) => queue.add(() => fetchDescription(cache, j.jobId)))
    );

    console.log("[Microsoft] Jobs successfully fetched");

    return jobs.map((j, i) => ({
      ...j,
      fullDescription: fullDescriptions[i] || j.descriptionTeaser,
    }));
  });

export const parseAll = (rawData: any[]): ParsedJob[] =>
  rawData
    .sort((a, b) => b.postedDate.localeCompare(a.postedDate))
    .map((j) => ({
      url: `https://careers.microsoft.com/us/en/job/${j.jobId}`,
      title: j.title,
      date: formatJobDate(moment.utc(j.postedDate)),
      location: j.location,
      preview: getHtmlText(j.descriptionTeaser),
      // fullDescription is already extracted from HTML, so no need to call getHtmlText or decodeEntities.
      description: j.fullDescription,
    }));
