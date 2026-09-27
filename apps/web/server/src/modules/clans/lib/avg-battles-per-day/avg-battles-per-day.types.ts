import type { ClanSnapshot } from '../../../../../generated';

export type BattlesPerDaySnapshot = Pick<ClanSnapshot, 'battlesDelta' | 'membersCount'>;
