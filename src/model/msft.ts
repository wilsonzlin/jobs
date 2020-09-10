export type Job = {
  country: string;
  cityState: string;
  companyName: string;
  parentLocale: string;
  additionalWorkLocation: undefined[];
  experience: string;
  msrReqType: boolean;
  structureData: {
    hiringOrganization: {
      ['@type']: string;
      name: string
    };
    jobLocation: {
      address: {
        addressCountry: string;
        ['@type']: string;
        addressLocality: string;
        addressRegion: string
      };
      ['@type']: string
    };
    employmentType: string;
    ['@type']: string;
    description: string;
    datePosted: string;
    title: string;
    ['@context']: string;
    occupationalCategory: string
  };
  targetStandardTitle: string;
  descriptionTeaser: string;
  primaryRecruiter: string;
  primaryWorkLocation: {
    country: string;
    city: string;
    state: string
  };
  careerStage: string;
  state: string;
  externalTracking: boolean;
  siteType: string;
  internalCategoryId: string;
  stateCountry: string;
  jobId: string;
  refNum: string;
  reqType: string;
  city: string;
  description: string;
  positionNumber: string;
  locale: string;
  title: string;
  multi_location: {
    country: string;
    cityState: string;
    city: string;
    latitude: string;
    location: string;
    state: string;
    cityCountry: string;
    cityStateCountry: string;
    stateCountry: string;
    longitude: string
  }[];
  jobQualifications: string;
  postedDate: string;
  jobSeqNo: string;
  visibilitySearchType: string[];
  jobResponsibilities: string;
  onBoardingContact: string;
  benefits_and_perks: {
    displayName: string;
    id: number
  }[];
  dateCreated: string;
  educationLevel: string;
  jobUrl: string;
  internalJobPostingDescriptionNote: string;
  cityStateCountry: string;
  talentpool: string;
  requisitionHiringManager: string;
  visibilitySiteType: string[];
  isReqTypeUniversity: boolean;
  employmentType: string;
  lastModifiedDate: string;
  parentRefNum: string;
  jobSummary: string;
  jobVisibility: string[];
  jobPostingId: string;
  applyUrl: string;
  location: string;
  cityCountry: string;
  requisitionAdminContact: string;
  category: string;
  operation: string;
  requisitionTravelPercentage: string;
  requisitionRoleType: string
};

export type JobDdo = {
  siteConfig: {
    status: string;
    errorCode: null;
    errorMsg: null;
    data: {
      urlMap: {
        home: string;
        category: string;
        job: string;
        jobcart: string;
        ['search-results']: string;
        ['glassdoor-reviews']: string;
      };
      categoryUrlMap: {
        ['MICRUS_Legal---Corporate-Affairs']: string;
        ['MICRUS_Supply-Chain---Operations-Management']: string;
        ['MICRUS_Field-Business-Leadership']: string;
        ['MICRUS_Business-Programs---Operations']: string;
        MICRUS_Engineering: string;
        ['MICRUS_Human-Resources']: string;
        MICRUS_Marketing: string;
        ['MICRUS_Technical-Sales']: string;
        MICRUS_Research: string;
        MICRUS_Evangelism: string;
        MICRUS_Finance: string;
        ['MICRUS_Hardware-Manufacturing-Engineering']: string;
        MICRUS_Retail: string;
        MICRUS_Services: string;
        ['MICRUS_Business-Development---Strategy']: string;
        MICRUS_Sales: string;
        ['MICRUS_Hardware-Engineering']: string;
        ['MICRUS_Product-Manufacturing-Operations']: string;
        ['MICRUS_IT-Operations']: string;
        ['MICRUS_Customer-Success']: string;
        ['MICRUS_Data-Center']: string;
        MICRUS_Unassigned: string;
      };
      siteSettings: {
        skipLogout: boolean;
        glassdoor: {};
        glassdoorReviews: {};
        twitter: {};
        linkedIn: {
          apiKey: string;
        };
        dropbox: {
          apiKey: string;
        };
        referalUrl: string;
        filePicker: {
          onedrive: {
            clientId: string;
            devkey: string;
          };
          dropbox: {
            clientId: string;
            devkey: string;
          };
          googledrive: {
            clientId: string;
            devkey: string;
          };
        };
        disableJobFilters: boolean;
        referrerParams: boolean;
        applyprofile: {
          flowurl: string;
          linkedin: string;
          live_aad: string;
          google: string;
          live: string;
          facebook: string;
          fb: string;
        };
        dynamics: {
          flowurl: string;
          domain_hint: {
            linkedin: string;
            live_aad: string;
            google: string;
            live: string;
            facebook: string;
            fb: string;
          };
        };
        oauth: {
          google: {
            loginUrl: string;
            logoutUrl: string;
            clientId: string;
            scope: string;
            redirectUri: string;
            response_type: string;
          };
          microsoftCorporate: {
            loginUrl: string;
            logoutUrl: string;
            clientId: string;
            resource: string;
            redirectUri: string;
            scope: string;
            response_type: string;
          };
          microsoft: {
            loginUrl: string;
            logoutUrl: string;
            clientId: string;
            redirectUri: string;
            scope: string;
            response_type: string;
          };
          facebook: {
            loginUrl: string;
            logoutUrl: string;
            clientId: string;
            redirectUri: string;
            scope: string;
            response_type: string;
          };
          linkedIn: {
            loginUrl: string;
            logoutUrl: string;
            clientId: string;
            redirectUri: string;
            scope: string;
            response_type: string;
            awliIntgCtxCode: string;
          };
          linkedinCorporate: {
            loginUrl: string;
            logoutUrl: string;
            clientId: string;
            scope: string;
            redirectUri: string;
            response_type: string;
            awliIntgCtxCode: string;
          };
        };
        refineSearch: {
          enabledFacets: string[];
          facetDisplayNames: {
            country: string;
            state: string;
            city: string;
            category: string;
            subCategory: string;
            employmentType: string;
            requisitionRoleType: string;
          };
          facetPlaceholderNames: {
            country: string;
            state: string;
            city: string;
            category: string;
            subCategory: string;
            employmentType: string;
            requisitionRoleType: string;
          };
          defaultFacetsToOpen: undefined[];
        };
        bundleVersions: {
          msgBundle: string;
          validationRules: string;
        };
        eagerLoadSearch: boolean;
      };
      refNum: string;
      siteVariant: string;
      recommendedTrackingConfig: {
        category: {
          storageKey: string;
          ddoKeysToStore: string[];
          maxKeysToStore: string;
        };
        job: {
          storageKey: string;
          ddoKeysToStore: string[];
          maxKeysToStore: string;
        };
        ['search-results']: {
          storageKey: string;
          ddoKeysToStore: string[];
          maxKeysToStore: string;
        }[];
      };
      locale: string;
      trackingConfig: {
        ddoDataPath: {
          jobDetail: string;
        };
        job_category_click: {
          trait14: string;
        };
        similar_job_click: {
          trait12: string;
          related: {
            ddo: {
              name: string;
              data: {
                trait5: string;
                trait14: string;
              };
            }[];
          };
        };
        linkedin_recommended_job_click: {
          trait5: string;
          trait14: string;
        };
        recommended_job_click: {
          trait5: string;
          trait14: string;
        };
        near_job_click: {
          trait5: string;
          trait14: string;
        };
        favorite_job_click: {
          trait5: string;
          trait14: string;
        };
        job_favorite_delete_click: {
          trait5: string;
          trait14: string;
        };
        type_ahead_search: {};
        similar_job_see_more_click: {};
        linkedin_login_click: {};
        linkedin_logout_click: {};
        view_all_glassdoor_reviews_click: {};
        homepage_category_click: {
          trait14: string;
        };
        category_click: {
          trait14: string;
        };
        job_category_search_click: {
          trait14: string;
        };
        job_click: {
          trait5: string;
          trait14: string;
        };
        previous_job_click: {
          trait5: string;
          trait14: string;
        };
        next_job_click: {
          trait5: string;
          trait14: string;
        };
        linkedin_recommended_category_click: {
          trait14: string;
        };
        recently_viewed_job_click: {
          trait5: string;
          trait14: string;
        };
        back_to_search_results_click: {};
      };
      pageNameMap: {
        ['404']: string;
        home: string;
        category: string;
        featuredOpportunities: string;
        businessUnit: string;
        job: string;
        ['search-results']: string;
        apply: string;
        glassdoorReviews: string;
        jobcart: string;
      };
      captchaConfig: {
        useCaptcha: boolean;
        apiUrl: string;
        siteKey: string;
      };
    };
    reqData: null;
  };
  categoryContentV2: {
    status: string;
    errorCode: null;
    errorMsg: null;
    data: {
      ['MICRUS_Legal---Corporate-Affairs']: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      ['MICRUS_Supply-Chain---Operations-Management']: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      ['MICRUS_Field-Business-Leadership']: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      ['MICRUS_Business-Programs---Operations']: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      MICRUS_Engineering: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      ['MICRUS_Data-Center']: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      ['MICRUS_Customer-Success']: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      ['MICRUS_Human-Resources']: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      MICRUS_Marketing: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      ['MICRUS_Technical-Sales']: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      MICRUS_Research: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      MICRUS_Evangelism: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      ['MICRUS_Hardware-Manufacturing-Engineering']: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      MICRUS_Finance: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      MICRUS_Retail: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      MICRUS_Services: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      ['MICRUS_Business-Development---Strategy']: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      MICRUS_Sales: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      ['MICRUS_Hardware-Engineering']: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
      ['MICRUS_IT-Operations']: {
        internalId: string;
        images: {
          bannerImage: string;
          iconImage: string;
        };
        imgSrc: string;
        key: string;
        url: string;
        content: string;
      };
    };
    reqData: null;
  };
  jobDetail: {
    status: number;
    hits: number;
    totalHits: number;
    data: {
      job: Job;
      isMultiLocationEnabled: boolean;
      multiLocationFieldName: string;
      multiLocationValues: string[];
    };
    eid: string;
  };
  flashParams: {};
};

export type Results = {
  refineSearch: {
    status: number;
    hits: number;
    totalHits: number;
    data: {
      jobs: {
        country: string;
        subCategory: string;
        industry: null;
        title: string;
        multi_location: string[];
        type: null;
        orgFunction: null;
        experience: string;
        locale: string;
        multi_location_array: {
          location: string;
        }[];
        jobSeqNo: string;
        postedDate: string;
        searchresults_display: null;
        descriptionTeaser: string;
        dateCreated: string;
        state: string;
        targetLevel: string;
        jd_display: null;
        reqId: null;
        badge: string;
        jobId: string;
        isMultiLocation: boolean;
        jobVisibility: string[];
        mostpopular: number;
        location: string;
        category: string;
        locationLatlong: null;
      }[];
      aggregations: {
        field: string;
        value: {
          ['United States']: number;
          India: number;
          China: number;
          ['Czech Republic']: number;
          Canada: number;
          Romania: number;
          Israel: number;
          Australia: number;
          Finland: number;
          Japan: number;
          Estonia: number;
          Ireland: number;
          ['Costa Rica']: number;
          ['United Kingdom']: number;
          Portugal: number;
          Mexico: number;
          Spain: number;
          Brazil: number;
          Egypt: number;
          ['Hong Kong SAR']: number;
          Norway: number;
          Singapore: number;
          Taiwan: number;
          Argentina: number;
          Chile: number;
          Colombia: number;
          Denmark: number;
          France: number;
          Jordan: number;
          Korea: number;
          Netherlands: number;
          ['New Zealand']: number;
          Serbia: number;
          Switzerland: number;
        };
      }[];
      searchConfig: {
        mostpopular: boolean;
      };
    };
    eid: string;
  };
}
