import { Prisma } from '../../../../../../generated';

export const latestSpecHistorySql = (gameVersionId: number): Prisma.Sql => Prisma.sql`
  SELECT DISTINCT ON (tank_id) tank_id AS "tankId", specs
  FROM vehicle_spec_history
  WHERE game_version_id <> ${gameVersionId}
  ORDER BY tank_id, captured_at DESC
`;
