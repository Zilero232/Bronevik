import type { NamesById } from '../../../community-core';
import type { Bracket } from '../../lib/bracket';
import type { TournamentWithParticipants } from '../../selects';

export type TournamentViewInput = {
  tournament: TournamentWithParticipants;
  nicknames: NamesById;
  bracket: Bracket | null;
  maxParticipants: number;
};
