import { REFERRAL } from '@bronevik/schemas';

import { ROUTES } from '@/shared/constants';

import type { ReferralLinkInput } from './referral-link.types';

export const referralLink = ({ origin, userId }: ReferralLinkInput): string => {
  const url = new URL(ROUTES.plus, origin);

  url.searchParams.set(REFERRAL.param, userId);

  return url.toString();
};
