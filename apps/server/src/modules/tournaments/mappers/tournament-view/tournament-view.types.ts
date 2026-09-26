import type { Tournament, TournamentParticipant } from '../../../../../generated';
import type { NamesById } from '../../../community-core';
import type { Bracket } from '../../lib/bracket';

export type TournamentWithParticipants = Tournament & {
  participants: TournamentParticipant[];
};

export type TournamentViewInput = {
  tournament: TournamentWithParticipants;
  nicknames: NamesById;
  bracket: Bracket | null;
  maxParticipants: number;
};
