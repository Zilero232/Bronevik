'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, KeyFigure, KeyFigures } from '@/ui-kit';

import { useServerFigures } from '../../../../../model/hooks';

export const ServerFigures = () => {
  const t = useTranslations('tank.stats');
  const { figures } = useServerFigures();

  if (figures.length === 0) {
    return <EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />;
  }

  return (
    <KeyFigures isFramed={false}>
      {figures.map(({ key, label, value, format, suffix, tone }) => (
        <KeyFigure key={key} format={format} label={label} size={tone ? 'xl' : 'lg'} suffix={suffix} tone={tone} value={value} />
      ))}
    </KeyFigures>
  );
};
