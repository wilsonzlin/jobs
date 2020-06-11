import cheerio from 'cheerio';
import {blk} from 'extlib/js/array/gen';
import {mapDefined} from 'extlib/js/optional/map';
import PQueue from 'p-queue';
import {Cache, fetch, ParsedJob} from './_common';

type Subset = {
  results: {
    url: string;
    title: string;
    location: string;
  }[];
  totalCount: number;
};

const RESULTS_PER_PAGE = 100;

export const fetchDescription = async (cache: Cache, url: string): Promise<string> =>
  (await cache.computeIfAbsent<string | undefined>(`job${url.replace(/\//g, '_')}.txt`, async () =>
    mapDefined(await fetch({
      uri: url,
    }), html => {
      const $ = cheerio.load(html);
      return $('._94t2').text().trim();
    }),
  )) ?? '';

export const fetchSubset = async (cache: Cache, page: number): Promise<Subset | undefined> =>
  await cache.computeIfAbsent<Subset | undefined>(`results${page}.json`, async () =>
    mapDefined(await fetch({
      uri: `https://www.facebook.com/careers/jobs/`,
      qs: {page, results_per_page: RESULTS_PER_PAGE},
    }), html => {
      const $ = cheerio.load(html);
      const $container = $('#search_result');
      const resultsTitle = $container.find('._8opg').text().trim();
      const totalCount = Number.parseInt(
        /^Find Your New Job \(([\d,]+)\)$/
          .exec(resultsTitle)?.[1]
          .replace(/,/g, '') || '',
        10,
      );
      if (!Number.isSafeInteger(totalCount) || totalCount <= 0) {
        throw new Error('Failed to detect total count');
      }
      const subset: Subset = {
        results: [],
        totalCount,
      };
      for (const $resultElem of $container.find('a[href^="/careers/jobs"]').get()) {
        const $result = $($resultElem);
        // This attribute definitely exists as it's how we selected this element.
        const url = $result.attr('href')!;
        const title = $result.find('._8sel').text();
        const location = $result.find('_8sen').text();
        subset.results.push({url, title, location});
      }
      return subset;
    }));

export const fetchAll = async (cache: Cache) =>
  cache.computeIfAbsent('raw.json', async () => {
    const queue = new PQueue({concurrency: 8});

    const first = await fetchSubset(cache, 0);
    if (!first) {
      throw new Error(`[Facebook] Failed to fetch first page`);
    }
    const {totalCount} = first;

    console.info(`[Facebook] Need to retrieve ${totalCount} jobs in chunks of ${RESULTS_PER_PAGE}`);

    const results = await Promise.all(blk(
      Math.ceil(totalCount / RESULTS_PER_PAGE),
      page => queue.add(() => fetchSubset(cache, page)),
    ));

    const jobs = results
      .flatMap(result => result?.results ?? []);

    const fullDescriptions = await Promise.all(
      jobs.map(j => queue.add(() => fetchDescription(cache, j.url))),
    );

    console.log('[Facebook] Jobs successfully fetched');

    return jobs.map((j, i) => ({
      ...j,
      fullDescription: fullDescriptions[i],
    }));
  });

export const parseAll = (rawData: any[]): ParsedJob[] => rawData;
