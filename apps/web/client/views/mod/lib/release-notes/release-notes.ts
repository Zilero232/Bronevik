import type { ReleaseNotes } from './release-notes.types';

import { MOD_RELEASE_NOTES } from '../../config';

const cleanLine = (line: string): string => line.replaceAll(MOD_RELEASE_NOTES.code, '').trim();

export const parseReleaseNotes = (text: string | null | undefined): ReleaseNotes => {
  const lines = (text ?? '').split(/\r?\n/u).map((line) => line.trim());
  const items = lines.filter((line) => MOD_RELEASE_NOTES.item.test(line)).map((line) => cleanLine(line.replace(MOD_RELEASE_NOTES.item, '')));
  const summary = lines.filter((line) => line !== '' && !MOD_RELEASE_NOTES.item.test(line)).map(cleanLine);

  return { summary, items };
};

export const gameLabel = (pattern: string): string => pattern.replace(MOD_RELEASE_NOTES.wildcard, '');
