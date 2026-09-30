import type { RefObject } from 'react';

import type { ClientSize } from '../../../../../shared/api/gameface';
import type { Drag } from '../../../../../shared/lib/hud-geometry';

export type UseStageDragInput = {
  screenRef: RefObject<ClientSize>;
};

export type StageDrag = Drag & { moved: boolean };
