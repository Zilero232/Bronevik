import type { Competition, CompetitionPage } from '@otmetki/schemas';
import type { GetCompetitionInput, ListCompetitionsInput } from './competitions.types';
import { competitionsControllerGet, competitionsControllerList } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const listCompetitions = ({ signal, ...query }: ListCompetitionsInput): Promise<CompetitionPage> =>
  fromSdk(() => competitionsControllerList({ ...SESSION_REQUEST, query, signal }));

export const getCompetition = ({ slug, code, signal }: GetCompetitionInput): Promise<Competition> =>
  fromSdk(() => competitionsControllerGet({ ...SESSION_REQUEST, path: { slug }, query: code ? { code } : undefined, signal }));
