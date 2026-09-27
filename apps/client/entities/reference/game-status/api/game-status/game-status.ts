import { referenceControllerServers, referenceControllerVersion } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { GameStatusRequest } from './game-status.types';

export const getGameVersion = ({ signal }: GameStatusRequest = {}) => fromSdk(() => referenceControllerVersion({ signal }));

export const getGameServers = ({ signal }: GameStatusRequest = {}) => fromSdk(() => referenceControllerServers({ signal }));
