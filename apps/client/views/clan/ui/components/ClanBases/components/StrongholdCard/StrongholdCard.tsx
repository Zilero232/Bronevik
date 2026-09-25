'use client';

import { StrongholdIcon } from '@bronevik/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { winRateTone } from '@/entities/player/stats';
import { percentText } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

import type { StrongholdCardProps } from './StrongholdCard.types';

import { STRONGHOLD } from '../../../../../config';
import { LevelPips } from '../LevelPips';

import s from './StrongholdCard.module.scss';

export const StrongholdCard = ({ stronghold }: StrongholdCardProps) => {
  const t = useTranslations('clans.bases.stronghold');
  const format = useFormatter();

  const { level, buildings, reserves, skirmishes, battles, winRate, totalResources } = stronghold;
  const levelOf = (value: number | null) => t('levelOf', { level: value ?? 0, max: STRONGHOLD.maxLevel });

  return (
    <article className={s.root}>
      <header className={s.head}>
        <StrongholdIcon aria-hidden className={s.icon} size={44} />
        <div className={s.title}>
          <span className={s.eyebrow}>{t('eyebrow')}</span>
          <h3 className={s.level}>{level === null ? t('levelUnknown') : t('level', { level })}</h3>
        </div>
        <LevelPips label={levelOf(level)} level={level ?? 0} max={STRONGHOLD.maxLevel} />
      </header>
      <dl className={s.summary}>
        <div>
          <dt>{t('battles')}</dt>
          <dd>{format.number(battles)}</dd>
        </div>
        <div>
          <dt>{t('winRate')}</dt>
          <dd>
            <RatingBadge tone={winRateTone(winRate)} value={percentText({ format, value: winRate })} />
          </dd>
        </div>
        <div>
          <dt>{t('resources')}</dt>
          <dd>{totalResources === null ? '—' : format.number(totalResources)}</dd>
        </div>
      </dl>
      <h4 className={s.subtitle}>{t('skirmishesTitle')}</h4>
      {skirmishes.length > 0 ? (
        <ul className={s.skirmishes}>
          {skirmishes.map((row) => (
            <li key={row.tier} className={s.skirmish}>
              <span className={s.name}>{t('tier', { tier: row.tier })}</span>
              <span className={s.muted}>{t('battlesCount', { count: row.battles })}</span>
              <RatingBadge size='sm' tone={winRateTone(row.winRate)} value={percentText({ format, value: row.winRate })} withPips={false} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={s.note}>{t('noSkirmishes')}</p>
      )}
      <h4 className={s.subtitle}>{t('buildingsTitle')}</h4>
      {buildings.length > 0 ? (
        <ul className={s.buildings}>
          {buildings.map((building) => (
            <li key={`${building.type}-${building.position ?? ''}`} className={s.building}>
              <span className={s.name}>{building.title ?? building.type}</span>
              <LevelPips label={levelOf(building.level)} level={building.level ?? 0} max={STRONGHOLD.maxLevel} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={s.note}>{t('noBuildings')}</p>
      )}
      <h4 className={s.subtitle}>{t('reservesTitle')}</h4>
      {reserves.length > 0 ? (
        <ul className={s.reserves}>
          {reserves.map((reserve) => (
            <li
              key={`${reserve.type}-${reserve.level ?? ''}-${reserve.status ?? ''}-${reserve.activatedAt ?? ''}`}
              className={s.reserve}
              data-empty={reserve.count === 0}
            >
              <span className={s.name}>{reserve.title ?? reserve.type}</span>
              <span className={s.reserveLevel}>{reserve.level === null ? '—' : t('reserveLevel', { level: reserve.level })}</span>
              <span className={s.count}>{t('count', { count: reserve.count ?? 0 })}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={s.note}>{t('reservesHidden')}</p>
      )}
    </article>
  );
};
