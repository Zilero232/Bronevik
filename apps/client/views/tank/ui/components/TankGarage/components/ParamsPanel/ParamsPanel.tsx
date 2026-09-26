'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, Tabs } from '@/ui-kit';

import { useTankParams } from '../../../../../model/hooks';
import { ParamRow } from '../ParamRow';

import s from './ParamsPanel.module.scss';

export const ParamsPanel = () => {
  const t = useTranslations('tank.params');
  const { tabs } = useTankParams();

  if (tabs.length === 0) {
    return (
      <Card padding='none'>
        <CardHeader title={t('title')} />
        <EmptyState title={t('empty')} />
      </Card>
    );
  }

  return (
    <Tabs
      items={tabs.map(({ value, label, rows }) => ({
        value,
        label,
        content: (
          <dl className={s.list}>
            {rows.map((row) => (
              <ParamRow key={row.key} row={row} />
            ))}
          </dl>
        )
      }))}
      aside={<span className={s.title}>{t('title')}</span>}
      className={s.root}
      variant='panel'
    />
  );
};
