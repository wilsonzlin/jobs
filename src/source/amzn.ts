import moment from 'moment';
import {Job} from '../model/amzn';
import {Cache, fetch} from './_common';

export const fetchSubset = async (cache: Cache, offset: number, limit: number): Promise<Job[]> =>
  cache.computeIfAbsent<Job[]>(`results${offset}l${limit}.json`, async () =>
    (await fetch({
      uri: 'https://amazon.jobs/en/search.json',
      qs: {
        offset,
        result_limit: limit,
        sort: 'recent',
      },
    })).jobs,
  );

// Due to limitation with Amazon.jobs, it's not possible to fetch results past 10,000.
export const fetchAll = async (cache: Cache) =>
  cache.computeIfAbsent('raw.json', async () =>
    fetchSubset(cache, 0, 10000));

export const parseAll = (rawData: Job[]) =>
  rawData
    .sort((a, b) => b.updated_time.localeCompare(a.updated_time))
    .map(j => ({
      id: j.id,
      url: `https://amazon.jobs${j.job_path}`,
      title: j.title,
      date: moment.utc(j.posted_date, 'MMMM D, YYYY').format('YYYY-M-D'),
      location: j.location,
      preview: j.description_short,
      description: [
        j.description,
        j.basic_qualifications,
        j.preferred_qualifications,
      ].join('\n'),
    }));
