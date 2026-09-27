import { ROUTES } from '@/shared/constants';
import { absoluteUrl } from '@/shared/seo';

import type { InviteLinkInput } from './competition-view.types';

export const inviteLink = ({ slug, inviteCode }: InviteLinkInput): string | null =>
  inviteCode ? absoluteUrl(`${ROUTES.competitions.detail(slug)}?code=${encodeURIComponent(inviteCode)}`) : null;
