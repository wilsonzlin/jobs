import {blk} from 'extlib/js/array/gen';
import {assertExists} from 'extlib/js/optional/assert';
import moment from 'moment';
import PQueue from 'p-queue';
import {Job, Results} from '../model/twtr';
import {Cache, fetch, formatJobDate, ParsedJob} from './_common';

export const fetchSubset = async (cache: Cache, offset: number): Promise<Results> =>
  cache.computeIfAbsent<Results>(`results${offset}.json`, async () =>
    JSON.parse(assertExists(await fetch({
      uri: 'https://careers.twitter.com/content/careers-twitter/en/roles.careers.search.json',
      qs: {
        offset,
        limit: 100,
        sortBy: 'modified',
        asc: 'false',
      },
    }))),
  );

export const fetchAll = async (cache: Cache) =>
  cache.computeIfAbsent('raw.json', async () => {
    const queue = new PQueue({concurrency: 8});

    const first = await fetchSubset(cache, 0);

    const pagination = first.pageCount;
    const total = first.totalCount;

    console.info(`[Twitter] Need to retrieve ${total} jobs in chunks of ${pagination}`);

    const results = await Promise.all(blk(
      Math.ceil(total / pagination),
      page => queue.add(() => fetchSubset(cache, page * pagination)),
    ));

    const jobs = results
      .flatMap(result => result.results);

    console.log('[Twitter] Jobs successfully fetched');
    return jobs;
  });

export const parseAll = (rawData: Job[]): ParsedJob[] =>
  rawData
    .sort((a, b) => b.modified - a.modified)
    .map(j => ({
      url: j.url,
      title: j.title,
      date: formatJobDate(moment.utc(j.modified)),
      location: j.locations.map(l => l.title).join('; '),
      preview: j.description,
      description: undefined,
    }));
