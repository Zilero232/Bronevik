import { stringify } from 'csv-stringify/browser/esm/sync';

import type { CsvCell, DownloadFileInput } from './data-file.types';

import { isBrowser } from '../env';
import { DATA_FILE } from './data-file.constants';

export const toCsv = (rows: readonly Readonly<Record<string, CsvCell>>[]): string => stringify([...rows], DATA_FILE.csv);

export const downloadFile = ({ name, content, type }: DownloadFileInput): void => {
  if (!isBrowser()) {
    return;
  }

  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');

  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};
