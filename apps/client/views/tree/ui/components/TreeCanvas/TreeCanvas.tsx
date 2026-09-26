'use client';

import { isNation } from '@otmetki/icons';
import { ReactFlowProvider } from '@xyflow/react';
import { useTranslations } from 'next-intl';

import { useHydrated } from '@/shared/lib';

import type { TreeCanvasProps } from './TreeCanvas.types';

import { TreeFlow } from '../TreeFlow';
import { TreeSkeleton } from '../TreeSkeleton';

import s from './TreeCanvas.module.scss';

export const TreeCanvas = ({ tree, layout, path, onSelect }: TreeCanvasProps) => {
  const t = useTranslations('tree.canvas');
  const tNations = useTranslations('game.nations');
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return <TreeSkeleton />;
  }

  return (
    <section aria-label={t('label', { nation: isNation(tree.nation) ? tNations(tree.nation) : tree.nation })} className={s.root}>
      <ReactFlowProvider>
        <TreeFlow layout={layout} path={path} tree={tree} onSelect={onSelect} />
      </ReactFlowProvider>
    </section>
  );
};
