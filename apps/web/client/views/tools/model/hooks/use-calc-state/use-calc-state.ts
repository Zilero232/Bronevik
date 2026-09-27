'use client';

import { useState } from 'react';

import type { UseCalcState } from './use-calc-state.types';

export const useCalcState = <T extends object>(initial: T): UseCalcState<T> => {
  const [values, setValues] = useState(initial);

  const field =
    <K extends keyof T>(key: K) =>
    (value: T[K]) =>
      setValues((current) => ({ ...current, [key]: value }));

  return { values, field, replace: setValues };
};
