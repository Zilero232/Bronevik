import type { MutableRef } from 'preact/hooks';

import type { ClientSize } from '../../../../../shared/api/gameface';
import type { Throttle } from '../../../../../shared/lib/throttle';

export type UseStageDragInput = {
  screenRef: MutableRef<ClientSize>;
  throttle: Throttle;
};
