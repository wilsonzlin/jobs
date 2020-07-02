import {blk} from 'extlib/js/array/gen';
import {createDistinctFilter} from 'extlib/js/array/members';
import {assertExists} from 'extlib/js/optional/assert';
import moment from 'moment';
import PQueue from 'p-queue';
import {Job, Results} from '../model/aapl';
import {Cache, fetch, formatJobDate, ParsedJob} from './_common';

export const fetchSubset = async (cache: Cache, page: number): Promise<Results> =>
  cache.computeIfAbsent<Results>(`results${page}.json`, async () =>
    JSON.parse(assertExists(await fetch({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      uri: 'https://jobs.apple.com/api/role/search',
      qs: {
        page,
      },
      body: JSON.stringify({
        query: '',
        filters: {
          range: {
            standardWeeklyHours: {
              start: null,
              end: null,
            },
          },
        },
        page,
        locale: 'en-us',
        sort: 'newest',
      }),
    }))));

export const fetchAll = async (cache: Cache) =>
  cache.computeIfAbsent('raw.json', async () => {
    const queue = new PQueue({concurrency: 8});

    const first = await fetchSubset(cache, 1);

    const total = first.totalRecords;
    const pagination = first.searchResults.length;

    console.info(`[Apple] Need to retrieve ${total} jobs in chunks of ${pagination}`);

    const results = await Promise.all(blk(
      Math.ceil(total / pagination),
      page => queue.add(() => fetchSubset(cache, page + 1)),
    ));

    const jobs = results
      .flatMap(result => result.searchResults)
      .filter(createDistinctFilter(j => j.id));

    console.log('[Apple] Jobs successfully fetched');
    return jobs;
  });

export const parseAll = (rawData: Job[]): ParsedJob[] =>
  rawData
    .map(j => ({
      url: `https://jobs.apple.com/en-us/details/${j.positionId}/`,
      title: j.postingTitle,
      date: formatJobDate(moment.utc(j.postingDate, j.localeInfo.dateFormat)),
      location: j.locations.map(l => l.name).join('; '),
      preview: j.jobSummary,
      description: j.jobSummary,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
