import { COMMUNITY_ACCOUNT } from '@/features/community/viewer';

import type { RegistrationFormValues } from '../lib/registration-form';

export const TOURNAMENT_PAGE = {
  minParticipants: 2,
  nowTickMs: 30_000,
  dateFormat: { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
} as const;

export const REGISTRATION_FORM_DEFAULTS: RegistrationFormValues = {
  accountId: COMMUNITY_ACCOUNT.primary,
  teamName: ''
};
