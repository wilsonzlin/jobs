import {join} from 'path';
import {Cache, ParsedJob} from './source/_common';
import * as amzn from './source/amzn';
import * as fb from './source/fb';
import * as goog from './source/goog';
import * as msft from './source/msft';

export {ParsedJob} from './source/_common';

export type Company = 'Amazon' | 'Facebook' | 'Google' | 'Microsoft';

export const COMPANIES = {
  'Amazon': amzn,
  'Facebook': fb,
  'Google': goog,
  'Microsoft': msft,
};

export type Result<C extends Company> = {
  [company in C]: ParsedJob[];
};

export const fetchAndParse = async <C extends Company> ({
  cacheDir,
  companies,
}: {
  cacheDir: string;
  companies: C[];
}): Promise<Result<C>> => {
  const res = {} as any;

  await Promise.all(companies.map(async (company) => {
    const {fetchAll, parseAll} = COMPANIES[company];
    const raw: any[] = await fetchAll(new Cache(join(cacheDir, company)));
    res[company] = parseAll(raw);
  }));

  return res;
};
