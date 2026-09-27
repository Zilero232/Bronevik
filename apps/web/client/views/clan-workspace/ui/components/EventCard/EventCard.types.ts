import type { ClanMember } from '@otmetki/schemas';

import type { UseEventActionsInput } from '../../../model/hooks';

export type EventCardProps = UseEventActionsInput & {
  isOfficer: boolean;
  members: readonly ClanMember[];
};
