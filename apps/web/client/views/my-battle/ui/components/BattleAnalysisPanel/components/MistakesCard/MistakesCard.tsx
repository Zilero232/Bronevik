'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState } from '@/ui-kit';

import type { MistakesCardProps } from './MistakesCard.types';

import s from './MistakesCard.module.scss';

export const MistakesCard = ({ mistakes }: MistakesCardProps) => {
  const t = useTranslations('analytics.battle');

  return (
    <Card padding='none'>
      <CardHeader title={t('mistakesTitle')} />
      {mistakes.length > 0 ? (
        <ul className={s.list}>
          {mistakes.map((mistake) => (
            <li key={mistake.code} className={s.item}>
              {mistake.text}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState isCompact title={t('noMistakes')} />
      )}
    </Card>
  );
};
