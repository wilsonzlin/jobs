import {join} from 'path';
import {Cache} from './source/_common';
import * as amzn from './source/amzn';
import * as goog from './source/goog';
import * as msft from './source/msft';

export type Company = 'Amazon' | 'Google' | 'Microsoft';

const COMPANIES = {
  'Amazon': amzn,
  'Google': goog,
  'Microsoft': msft,
};

export type Result<C extends Company> = {
  [company in C]: {
    id: string,
    url: string,
    title: string,
    date: string,
    location: string,
    preview: string,
    description: string,
  }[];
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
