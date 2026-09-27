import { GAMEFACE } from './gameface.constants';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const readGlobal = (name: string): Record<string, unknown> | null => {
  const value: unknown = Reflect.get(globalThis, name);

  return isRecord(value) ? value : null;
};

const call = (target: Record<string, unknown> | null, name: string, args: unknown[]): unknown => {
  const method = target?.[name];

  return typeof method === 'function' ? Reflect.apply(method, target, args) : undefined;
};

const whenReady = (callback: () => void): void => {
  const ready = readGlobal(GAMEFACE.engineGlobal)?.whenReady;

  if (ready instanceof Promise) {
    void ready.then(callback);

    return;
  }

  callback();
};

const readSize = (value: unknown): { width: number; height: number } | null => {
  if (!isRecord(value) || typeof value.width !== 'number' || typeof value.height !== 'number') {
    return null;
  }

  return { width: value.width, height: value.height };
};

export const gameface = {
  clientSize: (): { width: number; height: number } | null => readSize(call(readGlobal(GAMEFACE.viewEnvGlobal), GAMEFACE.clientSizeMethod, [])),
  state: (): string | null => {
    const state = readGlobal(GAMEFACE.modelGlobal)?.[GAMEFACE.stateProperty];

    return typeof state === 'string' ? state : null;
  },
  send: (message: string): boolean => {
    const model = readGlobal(GAMEFACE.modelGlobal);

    if (typeof model?.[GAMEFACE.sendCommand] !== 'function') {
      console.warn(`[OTMETKI] no Gameface model: ${message}`);

      return false;
    }

    call(model, GAMEFACE.sendCommand, [{ message }]);

    return true;
  },
  onDataChanged: (callback: () => void): void => {
    whenReady(() => {
      call(readGlobal(GAMEFACE.engineGlobal), 'on', [GAMEFACE.dataChangedEvent, callback]);
      callback();
    });
  }
};
