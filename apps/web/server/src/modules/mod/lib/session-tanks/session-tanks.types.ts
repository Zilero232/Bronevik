import type { Battle } from '../../../../../generated';

export type SessionBattleRow = Pick<Battle, 'damageDealt' | 'frags' | 'result' | 'spotted' | 'tankId'>;
