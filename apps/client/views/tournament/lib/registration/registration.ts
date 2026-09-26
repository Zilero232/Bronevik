import type { RegistrationInput, RegistrationState } from './registration.types';

export const registrationState = ({ tournament, now, isRegistered }: RegistrationInput): RegistrationState => {
  if (isRegistered) {
    return 'registered';
  }

  if (tournament.status === 'draft') {
    return 'notOpen';
  }

  if (tournament.status !== 'registration' || (tournament.registrationEndsAt !== null && new Date(tournament.registrationEndsAt) <= now)) {
    return 'closed';
  }

  return tournament.participants.length >= tournament.maxParticipants ? 'full' : 'open';
};
