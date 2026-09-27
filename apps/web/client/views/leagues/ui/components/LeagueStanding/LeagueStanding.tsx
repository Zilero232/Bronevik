'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, DeltaValue, KeyFigure, KeyFigures } from '@/ui-kit';

import type { LeagueStandingProps } from './LeagueStanding.types';

import { ValueCell } from '../LeagueTable/components';

import s from './LeagueStanding.module.scss';

export const LeagueStanding = ({ metric, standing: { me, status, ranked, behind, ahead } }: LeagueStandingProps) => {
  const t = useTranslations('social.leagues.standing');

  return (
    <Card padding='md' variant='well'>
      <CardHeader meta={status ? t(`zones.${status}`) : t('absent')} title={t('title')} />
      {me && (
        <KeyFigures>
          <KeyFigure label={t('place')} value={me.value === null ? t('unranked') : t('placeOf', { place: me.rank, total: ranked })} />
          <KeyFigure label={t('value')} value={<ValueCell metric={metric} value={me.value} />} />
          <KeyFigure
            hint={t('behindHint')}
            label={t('behind')}
            value={behind === null ? '—' : <DeltaValue className={s.delta} format='integer' value={behind} />}
          />
          <KeyFigure
            hint={t('aheadHint')}
            label={t('ahead')}
            value={ahead === null ? '—' : <DeltaValue className={s.delta} format='integer' value={ahead} />}
          />
        </KeyFigures>
      )}
    </Card>
  );
};
