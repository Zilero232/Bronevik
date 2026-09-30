import { GAMEFACE } from '../gameface.constants';

export const GAMEFACE_MOCK = {
  callbackId: 7,
  tooltipContentId: 11,
  tooltipDecoratorId: 12,
  properties: {
    state: GAMEFACE.model.state,
    feed: GAMEFACE.model.feed,
    escape: GAMEFACE.model.escape
  }
} as const;
