import type { ReleaseNotes } from '../../../lib/release-notes';

export type ModRelease = ReleaseNotes & {
  version: string;
  date: string;
  dateTime: string;
  games: string;
  changed: string[];
};
