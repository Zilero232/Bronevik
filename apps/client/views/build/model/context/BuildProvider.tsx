'use client';

import { useState } from 'react';

import { emptyLoadout } from '@/entities/tank/build';

import type { BuildSide } from '../../lib/stat-diff';
import type { BuildContextValue, BuildProviderProps } from './build-context.types';

import { buildCatalog } from '../../lib/build-catalog';
import { useBuildLoadouts } from '../hooks/use-build-loadouts';
import { BuildContext } from './build-context';

export const BuildProvider = ({ vehicle, options, children }: BuildProviderProps) => {
  const { a, b, setA, setB } = useBuildLoadouts();
  const [pickedSide, setPickedSide] = useState<BuildSide>('a');
  const [still, setStill] = useState(false);

  const side = b ? pickedSide : 'a';
  const active = side === 'b' && b ? b : a;

  const edit: BuildContextValue['edit'] = (change) => {
    if (side === 'b' && b) {
      setB(change(b));

      return;
    }

    setA(change(a));
  };

  const setCompare = (isOn: boolean) => {
    setB(isOn ? a : null);
    setPickedSide(isOn ? 'b' : 'a');
  };

  const copyAToB = () => setB(a);
  const resetActive = () => edit(emptyLoadout);

  return (
    <BuildContext
      value={{
        vehicle,
        options,
        catalog: buildCatalog(options),
        a,
        b,
        side,
        active,
        isCompare: b !== null,
        still,
        setSide: setPickedSide,
        setStill,
        edit,
        setCompare,
        copyAToB,
        resetActive
      }}
    >
      {children}
    </BuildContext>
  );
};
