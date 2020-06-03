import {Cache} from './source/_common';
import * as msft from './source/msft';
import * as amzn from './source/amzn';
import { join } from 'path';

export const fetchAndParseAll = async ({
  cacheDir,
}: {
  cacheDir: string;
}) => {
  const [
    Amazon,
    Microsoft,
  ] = await Promise.all([
    amzn.fetchAll(new Cache(join(cacheDir, 'amzn'))).then(amzn.parseAll),
    msft.fetchAll(new Cache(join(cacheDir, 'msft'))).then(msft.parseAll),
  ]);

  return {
    Amazon,
    Microsoft,
  };
};
