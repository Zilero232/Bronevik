import type { CompetitionScoring } from '@otmetki/schemas';

import type { CompetitionTeam } from '../../../../../generated';

export type ScoredLine = {
  damage: number;
  assist: number;
  blocked: number;
  frags: number;
  spotted: number;
  xp: number;
  wins: number;
  survived: number;
};

export type ScoreLineInput = {
  line: ScoredLine;
  scoring: CompetitionScoring;
};

export type ScoreBattlesInput = {
  battles: readonly ScoredLine[];
  scoring: CompetitionScoring;
  limit: number;
};

export type ScoreTotalsInput = {
  totals: ScoredLine;
  battles: number;
  scoring: CompetitionScoring;
  limit: number;
};

export type ParticipantScore = {
  score: number;
  battles: number;
};

export type RankableTeam = Pick<CompetitionTeam, 'battles' | 'id' | 'score'>;

export type CompetitionStatusInput = {
  startsAt: Date;
  endsAt: Date;
  now: Date;
};

export type TeamEntry = ParticipantScore;
