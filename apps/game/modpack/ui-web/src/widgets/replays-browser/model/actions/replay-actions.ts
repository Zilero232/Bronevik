import type { RunReplayActionInput } from './replay-actions.types';

import { REPLAYS } from '../../../../entities/replays';
import { send } from '../../../../shared/api/protocol';

export const runReplayAction = ({ action, row, value }: RunReplayActionInput): boolean =>
  send({ type: 'action', component: REPLAYS.componentId, action, row, value });

export const openSitePath = (path: string): boolean => send({ type: 'open', path });
