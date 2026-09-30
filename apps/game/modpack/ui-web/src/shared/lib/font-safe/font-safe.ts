import type { RichLine } from '../rich-text';

import { isRecord } from '../is-record';
import { FONT_SAFE } from './font-safe.constants';

const kept = new Set(FONT_SAFE.kept);
const replacements: Partial<Record<string, string>> = FONT_SAFE.replacements;

const safeChar = (char: string): string => {
  if ((char.codePointAt(0) ?? 0) < FONT_SAFE.firstUnsafe || kept.has(char)) {
    return char;
  }

  return replacements[char] ?? '';
};

export const fontSafe = (text: string): string => Array.from(text, safeChar).join('');

export const fontSafeData = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return fontSafe(value);
  }

  if (Array.isArray(value)) {
    return value.map(fontSafeData);
  }

  return isRecord(value) ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fontSafeData(item)])) : value;
};

export const fontSafeLines = (lines: RichLine[]): RichLine[] =>
  lines.map((line) => ({ ...line, runs: line.runs.map((run) => (run.kind === 'text' ? { ...run, text: fontSafe(run.text) } : run)) }));
