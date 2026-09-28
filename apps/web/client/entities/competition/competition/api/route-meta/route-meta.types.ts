import type { Competition } from '@otmetki/schemas';

export type CompetitionRouteMeta = Pick<Competition, 'title'> & {
  isPublic: boolean;
};
