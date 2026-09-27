'use client';

import { Camera, Maximize2, Minimize2, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { buttonVariants, IconButton } from '@/ui-kit';

import type { ViewerToolbarProps } from './ViewerToolbar.types';

import { VIEW_PRESETS } from '../../../config';

import s from './ViewerToolbar.module.scss';

export const ViewerToolbar = ({ isFullscreen, onPreset, onFullscreen, onScreenshot, onShare }: ViewerToolbarProps) => {
  const t = useTranslations('armor');

  return (
    <div aria-label={t('controls.toolbar')} className={s.root} role='toolbar'>
      <div aria-label={t('controls.presets')} className={s.presets} role='group'>
        {VIEW_PRESETS.map((preset) => (
          <button key={preset} className={buttonVariants({ variant: 'ghost', size: 'sm' })} type='button' onClick={() => onPreset(preset)}>
            {t(`presets.${preset}`)}
          </button>
        ))}
      </div>
      <div className={s.actions}>
        <IconButton aria-label={t('controls.screenshot')} size='sm' title={t('controls.screenshot')} variant='outline' onClick={onScreenshot}>
          <Camera aria-hidden size={16} />
        </IconButton>
        <IconButton aria-label={t('controls.share')} size='sm' title={t('controls.share')} variant='outline' onClick={onShare}>
          <Share2 aria-hidden size={16} />
        </IconButton>
        <IconButton
          aria-label={t(isFullscreen ? 'controls.exitFullscreen' : 'controls.fullscreen')}
          aria-pressed={isFullscreen}
          size='sm'
          variant='outline'
          onClick={onFullscreen}
        >
          {isFullscreen ? <Minimize2 aria-hidden size={16} /> : <Maximize2 aria-hidden size={16} />}
        </IconButton>
      </div>
    </div>
  );
};
