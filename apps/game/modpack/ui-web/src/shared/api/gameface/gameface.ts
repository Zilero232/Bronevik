import type { ClientSize, GamefaceBridge, InvokeInput } from './gameface.types';

import { isRecord } from '../../lib/is-record';
import { GAMEFACE } from './gameface.constants';

const invoke = ({ target, method, args }: InvokeInput): unknown => {
  const func = target?.[method];

  return typeof func === 'function' ? Reflect.apply(func, target, args) : undefined;
};

const toClientSize = (value: unknown): ClientSize | null => {
  if (!isRecord(value) || typeof value.width !== 'number' || typeof value.height !== 'number') {
    return null;
  }

  return { width: value.width, height: value.height };
};

const isButtonModel = (value: unknown): value is Record<string, unknown> =>
  isRecord(value) && value[GAMEFACE.button.marker] === GAMEFACE.button.markerValue && typeof value[GAMEFACE.button.open] === 'function';

export const createGamefaceBridge = (scope: object): GamefaceBridge => {
  const read = (name: string): Record<string, unknown> | null => {
    const value: unknown = Reflect.get(scope, name);

    return isRecord(value) ? value : null;
  };

  const whenReady = (callback: () => void): void => {
    const ready = read(GAMEFACE.globals.engine)?.[GAMEFACE.engine.whenReady];

    if (ready instanceof Promise) {
      void ready.then(callback);

      return;
    }

    callback();
  };

  const buttonModel = (): Record<string, unknown> | null => {
    const subViews = read(GAMEFACE.globals.subViews);
    const candidates = [read(GAMEFACE.globals.model), ...(subViews ? Object.values(subViews) : [])];

    for (const candidate of candidates) {
      const model = isRecord(candidate) && isRecord(candidate[GAMEFACE.model.nested]) ? candidate[GAMEFACE.model.nested] : candidate;

      if (isButtonModel(model)) {
        return model;
      }
    }

    return null;
  };

  return {
    clientSize: () => toClientSize(invoke({ target: read(GAMEFACE.globals.viewEnv), method: GAMEFACE.viewEnv.clientSize, args: [] })),
    resizeView: ({ width, height }) => {
      const viewEnv = read(GAMEFACE.globals.viewEnv);

      if (typeof viewEnv?.[GAMEFACE.viewEnv.resizeView] !== 'function') {
        return false;
      }

      invoke({ target: viewEnv, method: GAMEFACE.viewEnv.resizeView, args: [width, height] });

      return true;
    },
    state: () => {
      const state = read(GAMEFACE.globals.model)?.[GAMEFACE.model.state];

      return typeof state === 'string' ? state : null;
    },
    send: (message) => {
      const model = read(GAMEFACE.globals.model);

      if (typeof model?.[GAMEFACE.model.send] !== 'function') {
        console.warn(GAMEFACE.log.noModel, message);

        return false;
      }

      invoke({ target: model, method: GAMEFACE.model.send, args: [{ message }] });

      return true;
    },
    onDataChanged: (callback) => {
      whenReady(() => {
        invoke({ target: read(GAMEFACE.globals.engine), method: GAMEFACE.engine.on, args: [GAMEFACE.engine.dataChangedEvent, callback] });
        callback();
      });
    },
    openWindow: () => {
      const model = buttonModel();

      if (!model) {
        console.warn(GAMEFACE.log.noButtonModel);

        return false;
      }

      invoke({ target: model, method: GAMEFACE.button.open, args: [{}] });

      return true;
    }
  };
};

export const gameface = createGamefaceBridge(globalThis);
