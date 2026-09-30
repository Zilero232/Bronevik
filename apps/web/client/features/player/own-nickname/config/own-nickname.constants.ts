import type { NicknameFormValues } from '../lib/nickname-form';

export const NICKNAME_FORM_DEFAULT_VALUES: NicknameFormValues = { nickname: '' };

export const NICKNAME_ERROR_KINDS = ['notFound', 'server', 'invalid'] as const;

export const OWN_NICKNAME = {
  iconSize: 14,
  dashboardHash: 'my'
} as const;
