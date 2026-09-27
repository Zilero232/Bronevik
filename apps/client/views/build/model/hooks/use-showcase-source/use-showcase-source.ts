'use client';

import { useQueryState } from 'nuqs';
import { isIncludedIn } from 'remeda';

import { usePlus } from '@/features/plus/plus-gate';

import type { ShowcaseSource } from './use-showcase-source.types';

import { SHOWCASE, SHOWCASE_PARSERS } from '../../../config';

export const useShowcaseSource = () => {
  const { isPlus } = usePlus();
  const [picked, setPicked] = useQueryState('source', SHOWCASE_PARSERS.source.withOptions({ history: 'replace' }));

  const source = !isPlus && isIncludedIn(picked, SHOWCASE.plusSources) ? SHOWCASE_PARSERS.source.defaultValue : picked;

  const onSourceChange = (next: ShowcaseSource) => {
    void setPicked(next);
  };

  return { source, other: SHOWCASE.otherSource[source], isPlus, isShares: source === 'all', onSourceChange };
};
