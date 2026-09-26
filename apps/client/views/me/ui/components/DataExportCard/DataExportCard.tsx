'use client';

import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PlusBadge } from '@/features/plus/plus-gate';
import { Button } from '@/ui-kit';

import { DATA_EXPORTS } from '../../../config';
import { useDataExport } from '../../../model/hooks';
import { MeCard } from '../MeCard';

import s from './DataExportCard.module.scss';

export const DataExportCard = () => {
  const t = useTranslations('me.export');
  const { isPlus, pendingKind, onExport } = useDataExport();

  return (
    <MeCard description={t('description')} icon={<Download size={18} />} title={t('title')}>
      <div className={s.group}>
        <div className={s.head}>
          <span className={s.label}>{t('raw')}</span>
          <span className={s.hint}>{t('rawHint')}</span>
        </div>
        <div className={s.actions}>
          {DATA_EXPORTS.raw.map(({ kind, label }) => (
            <Button key={kind} disabled={pendingKind === kind} size='sm' variant='secondary' onClick={() => onExport(kind)}>
              {t(label)}
            </Button>
          ))}
        </div>
      </div>
      <div className={s.group}>
        <div className={s.head}>
          <span className={s.label}>
            {t('analytics')}
            {!isPlus && <PlusBadge />}
          </span>
          <span className={s.hint}>{t('analyticsHint')}</span>
        </div>
        <div className={s.actions}>
          {DATA_EXPORTS.analytics.map(({ kind, label }) => (
            <Button key={kind} disabled={!isPlus || pendingKind === kind} size='sm' variant='secondary' onClick={() => onExport(kind)}>
              {t(label)}
            </Button>
          ))}
        </div>
      </div>
    </MeCard>
  );
};
