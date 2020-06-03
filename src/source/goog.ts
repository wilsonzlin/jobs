import {blk} from 'extlib/js/array/gen';
import {createDistinctFilter} from 'extlib/js/array/members';
import moment from 'moment';
import PQueue from 'p-queue';
import {Job, Results} from '../model/goog';
import {Cache, fetch, getHtmlText} from './_common';

export const fetchSubset = async (cache: Cache, page: number): Promise<Results> =>
  cache.computeIfAbsent<Results>(`results${page}.json`, async () =>
    JSON.parse(await fetch({
      uri: 'https://careers.google.com/api/jobs/jobs-v1/search/',
      qs: {
        employment_type: 'FULL_TIME',
        page,
        sort_by: 'date',
      },
    })),
  );

// Due to limitation with Amazon.jobs, it's not possible to fetch results past 10,000.
export const fetchAll = async (cache: Cache) =>
  cache.computeIfAbsent('raw.json', async () => {
    const queue = new PQueue({concurrency: 8});

    const first = await fetchSubset(cache, 1);

    const pagination = Number.parseInt(first.page_size, 10);
    const total = Number.parseInt(first.count, 10);

    console.info(`[Google] Need to retrieve ${total} jobs in chunks of ${pagination}`);

    const results = await Promise.all(blk(
      Math.ceil(total / pagination),
      page => queue.add(() => fetchSubset(cache, page + 1)),
    ));

    const jobs = results
      .flatMap(result => result.jobs)
      .filter(createDistinctFilter(j => j.job_id));

    console.log('[Google] Jobs successfully fetched');
    return jobs;
  });

export const parseAll = (rawData: Job[]) =>
  rawData
    .sort((a, b) => b.publish_date.localeCompare(a.publish_date))
    .map(j => ({
      id: j.job_id,
      url: `https://careers.google.com/jobs/results/${/^jobs\/(\d+)$/.exec(j.job_id)![1]}`,
      title: j.job_title,
      date: moment.utc(j.publish_date).format('YYYY-M-D'),
      location: j.locations.join('; '),
      preview: getHtmlText(j.summary),
      description: getHtmlText(j.description),
    }));
