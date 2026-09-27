import type { ClanMember } from '@otmetki/schemas';

import type { UseEventActionsInput } from '../use-event-actions';

export type UseAttendanceEditorInput = UseEventActionsInput & {
  members: readonly ClanMember[];
};
