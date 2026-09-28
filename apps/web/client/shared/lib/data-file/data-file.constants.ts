import type { Options } from 'csv-stringify/browser/esm/sync';

export const DATA_FILE = {
  csv: {
    header: true,
    record_delimiter: 'windows',
    quoted_match: /[\r\n]/u,
    cast: { boolean: String }
  } satisfies Options,
  csvNewline: '\r\n',
  csvType: 'text/csv;charset=utf-8',
  jsonType: 'application/json;charset=utf-8'
} as const;
