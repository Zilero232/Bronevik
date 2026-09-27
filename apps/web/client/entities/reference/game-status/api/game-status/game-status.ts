import { referenceControllerServers, referenceControllerVersion } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { GameStatusQueryInput } from './game-status.types';

export const getGameVersion = ({ signal }: GameStatusQueryInput = {}) => fromSdk(() => referenceControllerVersion({ signal }));

export const getGameServers = ({ signal }: GameStatusQueryInput = {}) => fromSdk(() => referenceControllerServers({ signal }));
