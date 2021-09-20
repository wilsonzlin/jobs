export type Job = {
  id: string;
  title: string;
  categories: string[];
  apply_url: string;
  responsibilities: string;
  qualifications: string;
  company_id: string;
  company_name: string;
  locations: {
    display: string;
    lat: number;
    lon: number;
    address_lines: string[];
    city: string;
    post_code: string;
    country: string;
    country_code: string;
  }[];
  description: string;
  education_levels: string[];
  created: string;
  modified: string;
  publish_date: string;
  additional_instructions: string;
  locations_count: string;
  summary: string;
  building_pins: { lat: number; lng: number }[];
};

export type Results = {
  count: string;
  jobs: Job[];
  next_page: string;
  page_size: string;
};
