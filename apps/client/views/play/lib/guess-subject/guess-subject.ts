import type { GuessSubject } from '../compare-guess';
import type { GuessSubjectInput } from './guess-subject.types';

export const guessSubject = ({ vehicle, detail }: GuessSubjectInput): GuessSubject => {
  const row = detail?.serverStats.find(({ cohort }) => cohort === 'all');

  return { vehicle, avgDamage: row?.avgDamage ?? null, winRate: row?.winRate ?? null };
};
