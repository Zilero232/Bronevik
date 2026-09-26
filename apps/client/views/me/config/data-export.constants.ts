export const DATA_EXPORTS = {
  raw: [
    { kind: 'rawJson', label: 'json' },
    { kind: 'tanksCsv', label: 'tanksCsv' }
  ],
  analytics: [
    { kind: 'analyticsJson', label: 'json' },
    { kind: 'sessionsCsv', label: 'sessionsCsv' },
    { kind: 'battlesCsv', label: 'battlesCsv' }
  ],
  filePrefix: 'otmetki'
} as const;
