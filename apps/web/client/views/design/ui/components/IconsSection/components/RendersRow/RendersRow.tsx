'use client';

import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankImage } from '@/entities/tank/tank';
import { Button, Skeleton } from '@/ui-kit';

import { DESIGN_ICONS } from '../../../../../config';
import { useRenderSamples } from '../../../../../model/hooks';
import { DesignRow } from '../../../DesignRow';

import s from './RendersRow.module.scss';

export const RendersRow = () => {
  const t = useTranslations('design.icons');
  const { samples, isLoading, isError, isEmpty, onRetry } = useRenderSamples();

  return (
    <DesignRow label={t('groups.renders')}>
      {isLoading &&
        DESIGN_ICONS.renderSamples.map(({ key }) => (
          <span key={key} className={s.render}>
            <Skeleton height={DESIGN_ICONS.renderSkeleton.height} shape='block' width={DESIGN_ICONS.renderSkeleton.width} />
            <code className={s.name}>{key}</code>
          </span>
        ))}
      {isError && (
        <>
          <span className={s.name}>{t('rendersError')}</span>
          <Button size='sm' variant='secondary' onClick={onRetry}>
            <RotateCcw size={14} />
            {t('retry')}
          </Button>
        </>
      )}
      {isEmpty && <span className={s.name}>{t('rendersEmpty')}</span>}
      {samples.map(({ key, size, tank }) => (
        <span key={key} className={s.render}>
          <TankImage size={size} tank={tank} />
          <code className={s.name}>{key}</code>
        </span>
      ))}
    </DesignRow>
  );
};
