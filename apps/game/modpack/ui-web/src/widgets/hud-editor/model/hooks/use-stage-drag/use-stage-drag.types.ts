import type { RefObject } from 'react';

import type { ClientSize } from '../../../../../shared/api/gameface';
import type { Throttle } from '../../../../../shared/lib/throttle';

export type UseStageDragInput = {
  screenRef: RefObject<ClientSize>;
  throttle: Throttle;
};
