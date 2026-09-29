import type { ParticipantSeedsSqlInput } from './participant-seeds.types';

import { Prisma } from '../../../../../generated';

export const participantSeedsSql = ({ tournamentId, seededAccountIds }: ParticipantSeedsSqlInput): Prisma.Sql => Prisma.sql`
  UPDATE tournament_participant AS p
  SET seed = s.seed::int
  FROM unnest(${[...seededAccountIds]}::bigint[]) WITH ORDINALITY AS s(account_id, seed)
  WHERE p.tournament_id = ${tournamentId} AND p.account_id = s.account_id
`;
