import type { PinScope } from '../../../lib/pinned-ids';

export type UsePinToggleInput = {
  scope: PinScope;
  id: string;
  name: string;
};
