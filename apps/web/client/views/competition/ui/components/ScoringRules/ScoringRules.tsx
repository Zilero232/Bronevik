'use client';

import { COMPETITION_METRICS } from '@otmetki/schemas';
import { useFormatter, useTranslations } from 'next-intl';

import { Card, CardBody, CardHeader } from '@/ui-kit';

import type { ScoringRulesProps } from './ScoringRules.types';

import { COMPETITION_PAGE } from '../../../config';

import s from './ScoringRules.module.scss';

export const ScoringRules = ({ competition }: ScoringRulesProps) => {
  const t = useTranslations('competitions');
  const format = useFormatter();

  return (
    <Card padding='none'>
      <CardHeader title={t('rules.title')} />
      <CardBody className={s.body}>
        <dl className={s.weights}>
          {COMPETITION_METRICS.filter((metric) => competition.scoring[metric] > 0).map((metric) => (
            <div key={metric} className={s.weight}>
              <dt>{t(`metrics.${metric}`)}</dt>
              <dd className={s.value}>{format.number(competition.scoring[metric], COMPETITION_PAGE.weightFormat)}</dd>
            </div>
          ))}
        </dl>
        <p className={s.text}>{t('rules.points', { battles: competition.battlesPerPlayer })}</p>
        <p className={s.text}>{t('rules.sources')}</p>
        <p className={s.text}>{t('rules.fairPlay')}</p>
        <p className={s.hint}>{t('rules.refresh')}</p>
      </CardBody>
    </Card>
  );
};
