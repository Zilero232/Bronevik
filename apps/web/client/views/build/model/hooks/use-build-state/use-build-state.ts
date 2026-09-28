'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useLocale } from 'next-intl';
import { useState } from 'react';

import { emptyLoadout } from '@/entities/tank/build';
import { localizedText } from '@/shared/lib';

import type { BuildSide } from '../../../lib/stat-diff';
import type { BuildContextValue } from '../../context';
import type { UseBuildStateInput } from './use-build-state.types';

import { buildCatalog } from '../../../lib/build-catalog';
import { useBuildLoadouts } from '../use-build-loadouts';

export const useBuildState = ({ vehicle, options }: UseBuildStateInput): BuildContextValue => {
  const locale = useLocale();
  const { a, b, setA, setB } = useBuildLoadouts();
  const [pickedSide, setPickedSide] = useState<BuildSide>('a');
  const [still, setStill] = useBoolean(false);

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

  return {
    vehicle,
    options,
    catalog: buildCatalog({
      ...options,
      crewSkills: options.crewSkills.map((skill) => ({ ...skill, name: localizedText({ locale, text: skill.name, english: skill.nameEn }) }))
    }),
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
  };
};
