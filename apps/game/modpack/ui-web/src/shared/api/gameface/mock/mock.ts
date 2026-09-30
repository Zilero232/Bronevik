import { entries } from 'remeda';

import type { GamefaceMock, GamefaceMockInput, GamefaceMockPush } from './mock.types';

import { GAMEFACE } from '../gameface.constants';
import { GAMEFACE_MOCK } from './mock.constants';

const tooltipResources = () => ({
  views: {
    common: {
      tooltip_window: {
        simple_tooltip_content: { SimpleTooltipContent: () => GAMEFACE_MOCK.tooltipContentId },
        tooltip_window: { TooltipWindow: () => GAMEFACE_MOCK.tooltipDecoratorId }
      }
    }
  }
});

export const createGamefaceMock = ({ state, feed = '', clientSize, mouse, tooltips = false, onSend }: GamefaceMockInput): GamefaceMock => {
  const listeners: ((data: unknown, indexes: unknown, callbackIds: number[]) => void)[] = [];
  const sent: string[] = [];
  const inputAreas: number[][] = [];
  const viewEvents: unknown[] = [];
  const tooltipScope = tooltips ? { [GAMEFACE.globals.resources]: tooltipResources() } : {};
  const tooltipEnv = tooltips ? { [GAMEFACE.viewEvent.handle]: (event: unknown) => viewEvents.push(event) } : {};

  const model: Record<string, unknown> = {
    [GAMEFACE.model.state]: state,
    [GAMEFACE.model.feed]: feed,
    [GAMEFACE.model.escape]: 0
  };

  const push = (values: GamefaceMockPush): void => {
    entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        model[GAMEFACE_MOCK.properties[key]] = value;
      }
    });

    listeners.forEach((listener) => listener(model, [], [GAMEFACE_MOCK.callbackId]));
  };

  model[GAMEFACE.model.send] = ({ message }: { message: string }) => {
    sent.push(message);

    const next = onSend(message);

    if (next !== null) {
      push(typeof next === 'string' ? { state: next } : next);
    }
  };

  const engine = {
    [GAMEFACE.engine.whenReady]: Promise.resolve(),
    [GAMEFACE.engine.on]: (event: string, listener: (data: unknown, indexes: unknown, callbackIds: number[]) => void) => {
      if (event === GAMEFACE.engine.dataChangedEvent) {
        listeners.push(listener);
      }
    }
  };

  return {
    scope: {
      [GAMEFACE.globals.model]: model,
      [GAMEFACE.globals.engine]: engine,
      [GAMEFACE.globals.viewEnv]: {
        [GAMEFACE.viewEnv.clientSize]: clientSize,
        [GAMEFACE.dataChanged.register]: () => GAMEFACE_MOCK.callbackId,
        [GAMEFACE.viewEnv.inputArea]: (...area: number[]) => inputAreas.push(area),
        [GAMEFACE.viewEnv.mousePosition]: mouse,
        ...tooltipEnv
      },
      ...tooltipScope
    },
    push,
    sent: () => [...sent],
    inputAreas: () => [...inputAreas],
    viewEvents: () => [...viewEvents]
  };
};

export const installGamefaceMock = (mock: GamefaceMock): void => {
  Object.entries(mock.scope).forEach(([name, value]) => Reflect.set(globalThis, name, value));
};
