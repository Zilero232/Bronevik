import type { Tournament } from '@/entities/tournament/tournament';

export type RegistrationState = 'closed' | 'full' | 'notOpen' | 'open' | 'registered';

export type RegistrationInput = {
  tournament: Pick<Tournament, 'maxParticipants' | 'participants' | 'registrationEndsAt' | 'status'>;
  now: Date | null;
  isRegistered: boolean;
};
