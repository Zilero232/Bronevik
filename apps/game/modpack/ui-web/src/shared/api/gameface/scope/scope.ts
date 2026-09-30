import type { InvokeInput } from './scope.types';

import { isRecord } from '../../../lib/is-record';

export const invoke = ({ target, method, args }: InvokeInput): unknown => {
  const func = target?.[method];

  return typeof func === 'function' ? Reflect.apply(func, target, args) : undefined;
};

export const readGlobal = (scope: object, name: string): Record<string, unknown> | null => {
  const value: unknown = Reflect.get(scope, name);

  return isRecord(value) ? value : null;
};
