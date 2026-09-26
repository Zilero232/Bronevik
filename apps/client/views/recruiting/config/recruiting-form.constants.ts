import { REQUIREMENTS_FORM } from '@/features/community/stat-requirements';
import { COMMUNITY_ACCOUNT } from '@/features/community/viewer';

import type { RecruitingFormValues } from '../lib/recruiting-form';

import { RECRUITING_BOARD } from './recruiting.constants';

export const RECRUITING_FORM_DEFAULTS: RecruitingFormValues = {
  accountId: COMMUNITY_ACCOUNT.primary,
  title: '',
  body: '',
  requirements: REQUIREMENTS_FORM.emptyValues,
  expiresInDays: String(RECRUITING_BOARD.defaultExpiresInDays)
};
