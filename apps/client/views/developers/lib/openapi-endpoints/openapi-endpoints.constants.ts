export const OPENAPI_ENDPOINTS = {
  methods: ['get', 'post', 'put', 'patch', 'delete'],
  fallbackTag: 'other',
  versionPrefix: /^v\d+-/,
  param: /(\{[^}]+\})/
} as const;
