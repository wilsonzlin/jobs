export type Job = {
  company_id: string;
  company_name: string;
  description: string;
  job_id: string;
  job_title: string;
  locations: string[];
  locations_count: string;
  publish_date: string;
  summary: string;
};

export type Results = {
  count: string;
  jobs: Job[];
  next_page: string;
  page_size: string;
};
