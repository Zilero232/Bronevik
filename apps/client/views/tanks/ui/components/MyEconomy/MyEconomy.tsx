'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankLink } from '@/entities/tank/tank';
import { Card, CardHeader, EmptyState, KeyFigure, KeyFigures, QueryState, Skeleton } from '@/ui-kit';

import { TANKS_ECONOMY } from '../../../config';
import { useMyEconomy } from '../../../model/hooks';

import s from './MyEconomy.module.scss';

export const MyEconomy = () => {
  const t = useTranslations('tanks.economy.mine');
  const format = useFormatter();
  const { query, tanks, days } = useMyEconomy();

  return (
    <Card className={s.root} padding='none'>
      <CardHeader className={s.header} title={t('title', { days })} />
      <QueryState
        isCompact
        empty={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
        isEmpty={({ battles }) => battles === 0}
        query={query}
        skeleton={<Skeleton height={TANKS_ECONOMY.mySkeletonHeight} shape='block' />}
      >
        {(data) => (
          <>
            <KeyFigures isFramed={false}>
              <KeyFigure label={t('battles')} value={data.battles} />
              <KeyFigure label={t('credits')} value={data.totalCredits} />
              <KeyFigure label={t('net')} value={data.totalNet} />
              <KeyFigure hint={t('earnedHint')} label={t('earned')} tone='good' value={data.premiumBonus.earned} />
              <KeyFigure hint={t('missedHint')} label={t('missed')} tone='average' value={data.premiumBonus.missed} />
            </KeyFigures>
            {data.premiumBonus.perBattle !== null && (
              <p className={s.verdict}>{t('perBattle', { value: format.number(data.premiumBonus.perBattle) })}</p>
            )}
            <ul className={s.list}>
              {tanks.map((tank) => (
                <li key={tank.vehicle.tankId} className={s.row}>
                  <TankLink image='small' vehicle={tank.vehicle} />
                  <span className={s.value}>{t('tankLine', { battles: tank.battles, credits: format.number(tank.credits) })}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </QueryState>
    </Card>
  );
};
