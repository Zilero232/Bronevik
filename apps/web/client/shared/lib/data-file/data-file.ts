import type { CsvCell, DownloadFileInput } from './data-file.types';

import { isBrowser } from '../env';
import { DATA_FILE } from './data-file.constants';

const csvCell = (value: CsvCell): string => {
  if (value === null || value === undefined) {
    return '';
  }

  const text = String(value);

  return DATA_FILE.csvQuoted.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

export const toCsv = (rows: readonly Readonly<Record<string, CsvCell>>[]): string => {
  const [first] = rows;

  if (!first) {
    return '';
  }

  const columns = Object.keys(first);
  const lines = [columns.map(csvCell), ...rows.map((row) => columns.map((column) => csvCell(row[column])))];

  return `${lines.map((line) => line.join(',')).join(DATA_FILE.csvNewline)}${DATA_FILE.csvNewline}`;
};

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
