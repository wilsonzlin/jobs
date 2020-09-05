export type Job = {
  title: string;
  description: string;
  modified: number;
  internalJob: boolean;
  url: string;
  locations: {
    id: string;
    title: string;
  }[];
  teams: {
    id: string;
    title: string;
  }[];
};

export type Results = {
  results: Job[];
  pageCount: number;
  totalCount: number;
};
