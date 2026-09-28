import { ROUTES } from '@/shared/constants';

import type { OfficialEntryInput, OfficialEntryLink } from './official-entry.types';

export const officialEntryLink = ({ accountId, nickname }: OfficialEntryInput): OfficialEntryLink => ({
  href: ROUTES.players.profile(nickname ?? String(accountId)),
  label: nickname ?? `#${accountId}`
});
