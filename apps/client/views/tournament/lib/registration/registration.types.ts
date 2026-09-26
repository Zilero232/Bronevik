import type { Tournament } from '@/shared/api/tournaments';

export type RegistrationState = 'closed' | 'full' | 'notOpen' | 'open' | 'registered';

export type RegistrationInput = {
  tournament: Pick<Tournament, 'maxParticipants' | 'participants' | 'registrationEndsAt' | 'status'>;
  now: Date;
  isRegistered: boolean;
};
