'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, KeyFigure, KeyFigures } from '@/ui-kit';

import type { ReferenceCardProps } from './ReferenceCard.types';

export const ReferenceCard = ({ reference, efficiency }: ReferenceCardProps) => {
  const t = useTranslations('analytics.battle');

  return (
    <Card padding='none'>
      <CardHeader meta={reference ? t('reference.meta', { count: reference.battles }) : t('reference.none')} title={t('reference.title')} />
      <KeyFigures isFramed={false}>
        {efficiency.map(({ key, value, tone }) => (
          <KeyFigure
            key={key}
            format={{ style: 'percent', maximumFractionDigits: 0 }}
            label={t(`efficiency.${key}`)}
            tone={tone ?? 'steel'}
            value={value}
          />
        ))}
      </KeyFigures>
    </Card>
  );
};
