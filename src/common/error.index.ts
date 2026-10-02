export const errorCode = {
  apiCommon: {
    unauthorized: 'API30001',
    internalServerError: 'API30002',
    badRequest: 'API30003',
    invalidTenant: 'API30005',
    forbidden: 'API30007',
    notFound: 'API30008',
    rateLimited: 'API30009',
  },
  auth: {
    invalidCredentials: 'AUTH10001',
    accountDisabled: 'AUTH10002',
    invalidRefreshToken: 'AUTH10003',
    invalidToken: 'AUTH10004',
    userNotFound: 'AUTH10005',
    userAlreadyExists: 'AUTH10006',
  },
  apiDetails: {
    notFound: 'APID40001',
    alreadyExists: 'APID40002',
    invalidCredentials: 'APID40003',
  },
  company: {
    notFound: 'COMP50001',
    alreadyExists: 'COMP50002',
  },
  truck: {
    notFound: 'TRK60001',
    alreadyExists: 'TRK60002',
  },
  driver: {
    notFound: 'DRV70001',
    alreadyExists: 'DRV70002',
  },
  client: {
    notFound: 'CLI80001',
    alreadyExists: 'CLI80002',
  },
  delivery: {
    notFound: 'DEL90001',
    alreadyExists: 'DEL90002',
  },
  dcDistance: {
    notFound: 'DCD100001',
    alreadyExists: 'DCD100002',
  },
  eicher: {
    locationError: 'EICHER10001',
    locationDataMissing: 'EICHER10002',
    configurationMissing: 'EICHER10003',
    tokenResponseInvalid: 'EICHER10004',
    accessTokenMissing: 'EICHER10005',
    locationResponseInvalid: 'EICHER10006',
  },
} as const;

export const codes = {
  ...errorCode.apiCommon,
  ...errorCode.auth,
  ...errorCode.apiDetails,
  ...errorCode.company,
  ...errorCode.truck,
  ...errorCode.driver,
  ...errorCode.client,
  ...errorCode.delivery,
  ...errorCode.dcDistance,
  ...errorCode.eicher,
};