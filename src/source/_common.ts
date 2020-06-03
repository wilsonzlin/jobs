import cheerio from "cheerio";
import {wait} from 'extlib/js/async/timeout';
import {promises as fs} from 'fs';
import mkdirp from 'mkdirp';
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
  timeout= 30000,
  uri,
}: {
  headers?: { [name: string]: string };
  jitter?: number;
  maxRetries?: number;
  qs?: QueryParams;
  timeout?: number;
  uri: string;
}) => {
  for (let retry = 0; retry <= maxRetries; retry++) {
    await wait(Math.floor(Math.random() * jitter));
    try {
      const res = await req({headers, qs, timeout, uri});
      // Job could be missing (404), gone (410), etc.
      if (res.statusCode >= 400 && res.statusCode < 500) {
        break;
      }
      return res.body;
    } catch (error) {
      console.warn(`Attempt ${retry} failed with error:`);
      console.warn(error.message);
    }
  }
  return undefined;
};

export const getHtmlText = (...segments: string[]): string => segments
  .map(section => cheerio(`<div>${section}</div>`).text())
  .join('\n\n');

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
        throw e;
      }
      const value = await computeFn();
      await fs.writeFile(path, JSON.stringify(value));
      return value;
    }
  }
}
