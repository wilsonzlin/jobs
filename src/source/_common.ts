import cheerio from 'cheerio';
import {wait} from 'extlib/js/async/timeout';
import {promises as fs} from 'fs';
import mkdirp from 'mkdirp';
import {Moment} from 'moment';
import {join} from 'path';
import request, {CoreOptions, RequiredUriUrl, Response} from 'request';

export type QueryParams = { [name: string]: string | number };

const req = (params: CoreOptions & RequiredUriUrl): Promise<Response> =>
  new Promise((resolve, reject) =>
    request(params, (error, response) => {
      if (error) {
        reject(error);
      } else if (response.statusCode >= 500) {
        reject(Object.assign(new Error(`Server error (status ${response.statusCode}) while fetching ${response.request.href}`), {
          statusCode: response.statusCode,
          response,
        }));
      } else {
        resolve(response);
      }
    }));

export const fetch = async ({
  headers,
  jitter = 1000,
  maxRetries = 5,
  qs,
  timeout = 30000,
  uri,
}: {
  headers?: { [name: string]: string };
  jitter?: number;
  maxRetries?: number;
  qs?: QueryParams;
  timeout?: number;
  uri: string;
}): Promise<string | undefined> => {
  const errors = [];
  for (let retry = 0; retry <= maxRetries; retry++) {
    await wait(Math.floor(Math.random() * jitter));
    try {
      const res = await req({headers, qs, timeout, uri});
      // Job could be missing (404), gone (410), etc.
      return res.statusCode >= 400 && res.statusCode < 500 ? undefined : res.body;
    } catch (error) {
      errors.push(error.message);
    }
  }
  console.warn(`Failed all ${maxRetries + 1} attempts to retrieve ${uri} with errors:\n- ${errors.join('\n- ')}`);
  return undefined;
};

export const formatJobDate = (time: Moment) => time.format('YYYY-MM-DD');

export const getHtmlText = (...segments: (string | undefined)[]): string => segments
  .map(html => html && cheerio(`<div>${html.replace(/<br\s*\/*\s*>/g, '\n')}</div>`).text().trim())
  .join('\n\n')
  .trim();

export class Cache {
  constructor (
    private readonly dir: string,
  ) {
  }

  async computeIfAbsent<V> (file: string, computeFn: () => Promise<V>): Promise<V> {
    const path = join(this.dir, file);
    await mkdirp(this.dir);
    try {
      return JSON.parse(await fs.readFile(path, 'utf8'));
    } catch (e) {
      if (e.code != 'ENOENT') {
        console.warn(`Failed to load data from cache: ${e.message}`);
      }
      const value = await computeFn();
      try {
        await fs.writeFile(path, JSON.stringify(value));
      } catch (e) {
        console.warn(`Failed to save data to cache: ${e.message}`);
      }
      return value;
    }
  }
}

export type ParsedJob = {
  id?: string;
  url: string;
  title: string;
  date?: string;
  location?: string;
  preview?: string;
  description?: string;
};
