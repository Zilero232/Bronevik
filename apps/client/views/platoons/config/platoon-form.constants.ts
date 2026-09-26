import { COMMUNITY_ACCOUNT } from '@/features/community/viewer';

import type { PlatoonFormValues } from '../lib/platoon-form';

import { PLATOON_BOARD } from './platoons.constants';

export const PLATOON_FORM = {
  maxWn8: 10_000,
  messageRows: 3
} as const;

export const PLATOON_FORM_DEFAULTS: PlatoonFormValues = {
  accountId: COMMUNITY_ACCOUNT.primary,
  tiers: [],
  modes: [],
  tankIds: [],
  hasVoice: false,
  minWn8: '',
  message: '',
  availableFrom: '',
  availableUntil: '',
  expiresInHours: String(PLATOON_BOARD.defaultExpiresInHours)
};
