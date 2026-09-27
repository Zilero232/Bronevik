'use client';

import { take } from 'remeda';

import { SHOWCASE } from '../../../config';
import { shellMix } from '../../../lib/showcase';
import { useShowcaseUsage } from '../use-showcase-usage';

export const useShowcaseSupplies = () => {
  const usage = useShowcaseUsage();

  return { consumables: take(usage?.consumables ?? [], SHOWCASE.consumables), shells: usage ? shellMix({ shells: usage.shells }) : [] };
};
