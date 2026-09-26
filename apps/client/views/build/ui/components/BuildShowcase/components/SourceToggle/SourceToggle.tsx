'use client';

import { Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { SourceToggleProps } from './SourceToggle.types';

import { SHOWCASE } from '../../../../../config';

import s from './SourceToggle.module.scss';

export const SourceToggle = ({ source, isPlus, usage, onChange }: SourceToggleProps) => {
  const t = useTranslations('builds.showcase');

  return (
    <div className={s.root}>
      <div aria-label={t('source.label')} className={s.options} role='group'>
        {SHOWCASE.sources.map((option, index) => (
          <Fragment key={option}>
            {index > 0 && <span className={s.or}>{t('source.or')}</span>}
            {option === 'top1' && !isPlus ? (
              <Link data-locked className={s.option} href={ROUTES.plus} title={t('source.plus')}>
                <Lock aria-hidden size={14} />
                {t(`source.${option}`)}
              </Link>
            ) : (
              <button aria-pressed={option === source} className={s.option} type='button' onClick={() => onChange(option)}>
                {t(`source.${option}`)}
                {option === source && <motion.span aria-hidden className={s.underline} layoutId='build-source' transition={SHOWCASE.slide} />}
              </button>
            )}
          </Fragment>
        ))}
      </div>
      {usage && (
        <p className={s.sample}>
          {t('sample', { battles: usage.battles, days: usage.windowDays })}
          {usage.gameVersion && ` · ${t('version', { version: usage.gameVersion })}`}
        </p>
      )}
    </div>
  );
};
