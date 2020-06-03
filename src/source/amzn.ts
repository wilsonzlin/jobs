import moment from 'moment';
import {Job} from '../model/amzn';
import {Cache, fetch, getHtmlText} from './_common';

export const fetchSubset = async (cache: Cache, offset: number, limit: number): Promise<Job[]> =>
  cache.computeIfAbsent<Job[]>(`results${offset}l${limit}.json`, async () =>
    JSON.parse(await fetch({
      uri: 'https://amazon.jobs/en/search.json',
      qs: {
        offset,
        result_limit: limit,
        sort: 'recent',
      },
      // File can be huge, allow plenty of time.
      timeout: 20 * 60 * 1000,
    })).jobs,
  );

// Due to limitation with Amazon.jobs, it's not possible to fetch results past 10,000.
export const fetchAll = async (cache: Cache) =>
  cache.computeIfAbsent('raw.json', async () => {
    console.log('[Amazon] Fetching jobs...');
    const res = await fetchSubset(cache, 0, 10000);
    console.log('[Amazon] Jobs successfully fetched');
    return res;
  });

export const parseAll = (rawData: Job[]) =>
  rawData
    .map(j => ({
      id: j.id,
      url: `https://amazon.jobs${j.job_path}`,
      title: j.title,
      date: moment.utc(j.posted_date, 'MMMM D, YYYY').format('YYYY-M-D'),
      location: j.location,
      preview: j.description_short,
      description: getHtmlText(j.description, j.basic_qualifications, j.preferred_qualifications),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
