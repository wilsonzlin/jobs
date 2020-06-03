import {join} from 'path';
import {Cache} from './source/_common';
import * as amzn from './source/amzn';
import * as goog from './source/goog';
import * as msft from './source/msft';

const COMPANIES = {
  'Amazon': amzn,
  'Google': goog,
  'Microsoft': msft,
};

export const fetchAndParse = async ({
  cacheDir,
  companies,
}: {
  cacheDir: string;
  companies: ('Amazon' | 'Google' | 'Microsoft')[];
}) => {
  const res = {};

  await Promise.all(companies.map(async (company) => {
    const {fetchAll, parseAll} = COMPANIES[company];
    const raw: any[] = await fetchAll(new Cache(join(cacheDir, company)));
    res[company] = parseAll(raw);
  }));

  return res;
};
