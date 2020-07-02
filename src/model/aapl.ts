export type Job = {
  id: string;
  jobSummary: string;
  locations: {
    city: string;
    stateProvince: string;
    countryName: string;
    metro: string;
    region: string;
    name: string;
    countryID: string;
    level: number;
  }[];
  positionId: string;
  postingDate: string;
  postingTitle: string;
  localeInfo: {
    languageCode: string;
    dateFormat: string;
    defaultLocaleCode: string;
  };
  postDateInGMT?: string;
  transformedPostingTitle: string;
  reqId: string;
  managedPipelineRole: boolean;
  standardWeeklyHours: number;
  team: {
    teamName: string;
    teamID: string;
    teamCode: string;
  };
  homeOffice: boolean;
};

export type Results = {
  searchResults: Job[];
  totalRecords: number;
};
