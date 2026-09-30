import type { GamefaceBridge } from './gameface.types';

import { createHangarButton } from './hangar-button';
import { createViewEnv } from './view-env';
import { createViewModel } from './view-model';

export const createGamefaceBridge = (scope: object): GamefaceBridge => ({
  ...createViewEnv(scope),
  ...createViewModel(scope),
  ...createHangarButton(scope)
});

export const gameface = createGamefaceBridge(globalThis);
