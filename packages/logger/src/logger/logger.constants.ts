export const REDACTION = {
  censor: '[redacted]',
  paths: [
    'req.headers.authorization',
    'req.headers.cookie',
    'req.headers["x-api-key"]',
    'password',
    '*.password',
    'token',
    '*.token',
    'accessToken',
    '*.accessToken',
    'access_token',
    '*.access_token',
    'refreshToken',
    '*.refreshToken',
    'apiKey',
    '*.apiKey',
    'secret',
    '*.secret',
    'auth',
    '*.auth'
  ]
} as const;

export const TRANSPORT = {
  jsonFormat: 'json',
  prettyTarget: 'pino-pretty',
  timeFormat: 'HH:MM:ss',
  baseIgnored: ['pid', 'hostname', 'service']
} as const;

export const DEFAULT_LEVEL = {
  development: 'debug',
  production: 'info'
} as const;
