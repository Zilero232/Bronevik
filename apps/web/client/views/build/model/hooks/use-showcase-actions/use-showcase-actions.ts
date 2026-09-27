'use client';

import { useBuildContext } from '../../context';
import { useBuildView } from '../use-build-view';
import { useRecommendedBuild } from '../use-recommended-build';
import { useShareLink } from '../use-share-link';
import { useShowcaseSource } from '../use-showcase-source';

export const useShowcaseActions = () => {
  const { edit } = useBuildContext();
  const { source } = useShowcaseSource();
  const { data } = useRecommendedBuild(source);
  const { onViewChange } = useBuildView();
  const share = useShareLink();

  const loadout = data?.loadout ?? null;

  const onOpenEditor = () => {
    if (loadout) {
      edit(() => loadout);
    }

    onViewChange('editor');
  };

  const onShare = () => void share();

  return { hasLoadout: loadout !== null, onOpenEditor, onShare };
};
