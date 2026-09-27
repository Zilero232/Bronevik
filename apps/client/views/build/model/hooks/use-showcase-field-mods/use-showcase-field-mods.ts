'use client';

import { splitAt } from 'remeda';

import type { ShowcaseRingSide } from './use-showcase-field-mods.types';

import { fieldModRing } from '../../../lib/showcase';
import { useBuildContext } from '../../context';
import { useShowcaseUsage } from '../use-showcase-usage';

export const useShowcaseFieldMods = (side: ShowcaseRingSide) => {
  const { catalog } = useBuildContext();
  const usage = useShowcaseUsage();

  const pairs = fieldModRing({ steps: catalog.fieldSteps, usage });
  const [left, right] = splitAt(pairs, Math.ceil(pairs.length / 2));

  return side === 'left' ? left : right;
};
