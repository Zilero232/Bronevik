import type { ClientSize, GamefaceBridge, InputArea, ViewRect } from './gameface.types';

import { isRecord } from '../../lib/is-record';
import { GAMEFACE } from './gameface.constants';
import { invoke, readGlobal } from './scope';

const toClientSize = (value: unknown): ClientSize | null => {
  if (!isRecord(value) || typeof value.width !== 'number' || typeof value.height !== 'number') {
    return null;
  }

  return { width: value.width, height: value.height };
};

const toPoint = (value: unknown): { x: number; y: number } | null => {
  if (!isRecord(value) || typeof value.x !== 'number' || typeof value.y !== 'number') {
    return null;
  }

  return { x: value.x, y: value.y };
};

const isButtonModel = (value: unknown): value is Record<string, unknown> =>
  isRecord(value) && value[GAMEFACE.button.marker] === GAMEFACE.button.markerValue && typeof value[GAMEFACE.button.open] === 'function';

export const createGamefaceBridge = (scope: object): GamefaceBridge => {
  const read = (name: string): Record<string, unknown> | null => readGlobal(scope, name);

  const whenReady = (callback: () => void): void => {
    const ready = read(GAMEFACE.globals.engine)?.[GAMEFACE.engine.whenReady];

    if (ready instanceof Promise) {
      void ready.then(callback);

      return;
    }

    callback();
  };

  const subViewModels = (): unknown[] => {
    const subViews = read(GAMEFACE.globals.subViews);
    const ids = invoke({ target: subViews, method: GAMEFACE.subViews.ids, args: [] });

    if (!Array.isArray(ids)) {
      return [];
    }

    return ids.map((id: unknown) => {
      const view = invoke({ target: subViews, method: GAMEFACE.subViews.get, args: [id] });

      return isRecord(view) ? view[GAMEFACE.model.nested] : null;
    });
  };

  const buttonModel = (): Record<string, unknown> | null => {
    const candidates = [read(GAMEFACE.globals.model), ...subViewModels()];

    for (const candidate of candidates) {
      const model = isRecord(candidate) && isRecord(candidate[GAMEFACE.model.nested]) ? candidate[GAMEFACE.model.nested] : candidate;

      if (isButtonModel(model)) {
        return model;
      }
    }

    return null;
  };

  const clientSize = (): ClientSize | null =>
    toClientSize(invoke({ target: read(GAMEFACE.globals.viewEnv), method: GAMEFACE.viewEnv.clientSize, args: [] }));

  const viewCall = (method: string, args: unknown[] = []): unknown => invoke({ target: read(GAMEFACE.globals.viewEnv), method, args });

  const viewRect = (): ViewRect | null => {
    const position = toPoint(viewCall(GAMEFACE.viewEnv.viewPosition));
    const size = toClientSize(viewCall(GAMEFACE.viewEnv.viewSize));

    return position && size ? { ...position, ...size } : null;
  };

  const remScale = (): number | null => {
    const scale = viewCall(GAMEFACE.viewEnv.remToPx, [1]);

    return typeof scale === 'number' && Number.isFinite(scale) && scale > 0 ? scale : null;
  };

  const resizeView = ({ width, height }: ClientSize): boolean => {
    const viewEnv = read(GAMEFACE.globals.viewEnv);

    if (typeof viewEnv?.[GAMEFACE.viewEnv.resizeView] !== 'function') {
      return false;
    }

    invoke({ target: viewEnv, method: GAMEFACE.viewEnv.resizeView, args: [width, height] });

    return true;
  };

  return {
    clientSize,
    clientSizeRem: () => toClientSize(viewCall(GAMEFACE.viewEnv.clientSizeRem)),
    viewRect,
    remScale,
    mousePosition: () => toPoint(viewCall(GAMEFACE.viewEnv.mousePosition)),
    resizeView,
    fitView: () => {
      const client = clientSize();

      return client !== null && resizeView(client);
    },
    state: () => {
      const state = read(GAMEFACE.globals.model)?.[GAMEFACE.model.state];

      return typeof state === 'string' ? state : null;
    },
    feed: () => {
      const feed = read(GAMEFACE.globals.model)?.[GAMEFACE.model.feed];

      return typeof feed === 'string' ? feed : null;
    },
    escape: () => {
      const asked = read(GAMEFACE.globals.model)?.[GAMEFACE.model.escape];

      return typeof asked === 'number' ? asked : null;
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
        let registered: unknown = null;

        const onChanged = (_data: unknown, _indexes: unknown, callbackIds: unknown): void => {
          if (registered === null || !Array.isArray(callbackIds) || callbackIds.includes(registered)) {
            callback();
          }
        };

        invoke({ target: read(GAMEFACE.globals.engine), method: GAMEFACE.engine.on, args: [GAMEFACE.engine.dataChangedEvent, onChanged] });

        const { register, path, rootId, trackSubItems } = GAMEFACE.dataChanged;

        registered = invoke({ target: read(GAMEFACE.globals.viewEnv), method: register, args: [path, rootId, trackSubItems] }) ?? null;
        callback();
      });
    },
    setInputArea: ({ left, top, width, height }: InputArea) => {
      const viewEnv = read(GAMEFACE.globals.viewEnv);

      if (typeof viewEnv?.[GAMEFACE.viewEnv.inputArea] !== 'function') {
        return false;
      }

      invoke({ target: viewEnv, method: GAMEFACE.viewEnv.inputArea, args: [left, top, width, height] });

      return true;
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
