'use client';

import { Panel, useReactFlow } from '@xyflow/react';
import { Maximize, Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton } from '@/ui-kit';

import { TREE_VIEW } from '../../../config';

import s from './TreeControls.module.scss';

export const TreeControls = () => {
  const t = useTranslations('tree.controls');
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  return (
    <Panel className={s.root} position='top-right'>
      <IconButton aria-label={t('zoomIn')} size='sm' variant='outline' onClick={() => zoomIn()}>
        <Plus size={16} />
      </IconButton>
      <IconButton aria-label={t('zoomOut')} size='sm' variant='outline' onClick={() => zoomOut()}>
        <Minus size={16} />
      </IconButton>
      <IconButton
        aria-label={t('fit')}
        size='sm'
        variant='outline'
        onClick={() => fitView({ padding: TREE_VIEW.fitPadding, duration: TREE_VIEW.fitDuration })}
      >
        <Maximize size={15} />
      </IconButton>
    </Panel>
  );
};
