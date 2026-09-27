'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { percentText } from '@/shared/lib';
import { ProgressBar } from '@/ui-kit';

import type { ShellUsageProps } from './ShellUsage.types';

import { shellKindKey } from '../../../../../lib';

import s from './ShellUsage.module.scss';

export const ShellUsage = ({ shells }: ShellUsageProps) => {
  const t = useTranslations('tank.builds');
  const format = useFormatter();

  return (
    <div className={s.root}>
      <h4 className={s.title}>{t('shells')}</h4>
      <ol className={s.list}>
        {shells.map(({ shellId, kind, isPremium, ammoShare, avgCount }) => (
          <li key={shellId}>
            <ProgressBar
              label={
                <span className={s.label}>
                  {t(`shellKinds.${shellKindKey(kind)}`)}
                  {isPremium && <span className={s.premium}>{t('premium')}</span>}
                </span>
              }
              valueLabel={
                <span className={s.value}>
                  {percentText({ format, value: ammoShare * 100, digits: 0 })}
                  <span className={s.count}>{t('avgCount', { count: Math.round(avgCount) })}</span>
                </span>
              }
              size='sm'
              tone='steel'
              value={ammoShare * 100}
            />
          </li>
        ))}
      </ol>
    </div>
  );
};
