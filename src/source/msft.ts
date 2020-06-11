import cheerio from 'cheerio';
import {blk} from 'extlib/js/array/gen';
import {createDistinctFilter} from 'extlib/js/array/members';
import {assertExists} from 'extlib/js/optional/assert';
import {mapOptional} from 'extlib/js/optional/map';
import moment from 'moment';
import PQueue from 'p-queue';
import {Job, JobDdo, Results, ResultsDdo} from '../model/msft';
import {Cache, fetch, formatJobDate, getHtmlText, ParsedJob, QueryParams} from './_common';

const DDO_BEFORE = 'phApp.ddo = ';
const DDO_AFTER = '; phApp.sessionParams';

// Use `null` for missing data as `undefined` cannot be serialised into JSON.

export const fetchDdo = async <R extends {}> (uri: string, qs?: QueryParams): Promise<R | null> =>
  mapOptional(await fetch({
    uri,
    qs,
    headers: {
      // User agent is required, as otherwise the page responds with an error.
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    },
  }), body => {
    const $ = cheerio.load(body);
    for (const $script of $('script').get()) {
      const js = $($script).contents().text();
      const start = js.indexOf(DDO_BEFORE);
      if (start != -1) {
        return JSON.parse(js.slice(start + DDO_BEFORE.length, js.indexOf(DDO_AFTER, start)));
      }
    }
  }) ?? null;

export const fetchDescription = async (cache: Cache, id: string | number): Promise<string> =>
  mapOptional(
    await cache.computeIfAbsent<Job | null>(`job${id}.json`, async () =>
      (await fetchDdo<JobDdo>(`https://careers.microsoft.com/professionals/us/en/job/${id}/`))?.jobDetail?.data?.job ?? null,
    ),
    job => getHtmlText(job.description, job.jobSummary, job.jobResponsibilities, job.jobQualifications),
  ) ?? '';

export const fetchSubset = async (cache: Cache, from: number): Promise<Results> =>
  await cache.computeIfAbsent<Results>(`results${from}.json`, async () =>
    assertExists(await fetchDdo<ResultsDdo>(`https://careers.microsoft.com/us/en/search-results`, {
      from,
      s: 1, // This is required, otherwise `from` is ignored.
      rt: 'professional', // Professional jobs.
    })).eagerLoadRefineSearch,
  );

export const fetchAll = async (cache: Cache) =>
  cache.computeIfAbsent('raw.json', async () => {
    const queue = new PQueue({concurrency: 8});

    const first = await fetchSubset(cache, 0);
    const pagination = first.hits;
    const total = first.totalHits;

    console.info(`[Microsoft] Need to retrieve ${total} jobs in chunks of ${pagination}`);

    const results = await Promise.all(blk(
      Math.ceil(total / pagination),
      page => queue.add(() => fetchSubset(cache, page * pagination)),
    ));

    const jobs = results
      .flatMap(result => result.data.jobs)
      .filter(createDistinctFilter(j => j.jobId));

    const fullDescriptions = await Promise.all(
      jobs.map(j => queue.add(() => fetchDescription(cache, j.jobId))),
    );

    console.log('[Microsoft] Jobs successfully fetched');

    return jobs.map((j, i) => ({
      ...j,
      fullDescription: fullDescriptions[i] || j.descriptionTeaser,
    }));
  });

export const parseAll = (rawData: any[]): ParsedJob[] =>
  rawData
    .sort((a, b) => b.postedDate.localeCompare(a.postedDate))
    .map(j => ({
      url: `https://careers.microsoft.com/us/en/job/${j.jobId}`,
      title: j.title,
      date: formatJobDate(moment.utc(j.postedDate)),
      location: j.location,
      preview: getHtmlText(j.descriptionTeaser),
      // fullDescription is already extracted from HTML, so no need to call getHtmlText or decodeEntities.
      description: j.fullDescription,
    }));
