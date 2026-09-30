'use client';

import { Lock } from 'lucide-react';
import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import { PlusTeaser } from '@/features/plus/plus-gate';
import { Popover, Skeleton } from '@/ui-kit';

import { SHOWCASE } from '../../../../../config';
import { useSourceToggle } from '../../../../../model/hooks';

import s from './SourceToggle.module.scss';

export const SourceToggle = () => {
  const t = useTranslations('builds.showcase');
  const { source, isPlus, usage, isUsagePending, hasSample, onSourceChange } = useSourceToggle();

  return (
    <div className={s.root}>
      <div aria-label={t('source.label')} className={s.options} role='group'>
        {SHOWCASE.sources.map((option, index) => (
          <Fragment key={option}>
            {index > 0 && <span className={s.or}>{t('source.or')}</span>}
            {option === 'top1' && !isPlus ? (
              <Popover
                trigger={
                  <button data-locked aria-label={`${t(`source.${option}`)} · ${t('source.plus')}`} className={s.option} type='button'>
                    <Lock aria-hidden size={14} />
                    {t(`source.${option}`)}
                  </button>
                }
              >
                <PlusTeaser feature={SHOWCASE.plusFeature} />
              </Popover>
            ) : (
              <button aria-pressed={option === source} className={s.option} type='button' onClick={() => onSourceChange(option)}>
                {t(`source.${option}`)}
                {option === source && <m.span aria-hidden className={s.underline} layoutId='build-source' transition={SHOWCASE.slide} />}
              </button>
            )}
          </Fragment>
        ))}
      </div>
      {!usage && isUsagePending && (
        <p aria-hidden className={s.sample}>
          <Skeleton width='16em' />
        </p>
      )}
      {usage && (
        <p className={s.sample}>
          {hasSample ? t('sample', { battles: usage.battles, days: usage.windowDays }) : t('noSample', { days: usage.windowDays })}
          {usage.gameVersion && ` · ${t('version', { version: usage.gameVersion })}`}
        </p>
      )}
    </div>
  );
};
