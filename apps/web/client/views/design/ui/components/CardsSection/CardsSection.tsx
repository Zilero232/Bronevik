'use client';

import { MasteryIcon, NATIONS, TANK_CLASSES } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { MarkProgress } from '@/entities/player/marks';
import { TankShowcaseCard, WinRateCell } from '@/entities/tank/tank';
import { IconFilter, Podium, PodiumCard } from '@/ui-kit';

import { PATTERN_SPECIMENS } from '../../../config';
import { useDesignTankStats, usePatternFilters } from '../../../model/hooks';
import { DesignBlock } from '../DesignBlock';
import { DesignRow } from '../DesignRow';

import s from './CardsSection.module.scss';

export const CardsSection = () => {
  const t = useTranslations('design.cards');
  const tCommon = useTranslations('common');
  const format = useFormatter();
  const { data } = useDesignTankStats();
  const { tiers, setTiers, classes, setClasses, nations, setNations } = usePatternFilters();

  const showcase = data?.items.slice(0, PATTERN_SPECIMENS.showcaseCount) ?? [];

  return (
    <DesignBlock id='cards' title={t('title')}>
      <DesignRow className={s.wide} label={t('podium')}>
        <Podium aria-label={t('podium')} className={s.wide}>
          {PATTERN_SPECIMENS.podium.map(({ rank, name, value, battles, tone }) => (
            <PodiumCard
              key={rank}
              glyph={<MasteryIcon level='master' />}
              meta={t('battles', { count: battles })}
              metricLabel={tCommon('ratings.wn8')}
              name={name}
              rank={rank}
              rankLabel={t('place', { rank })}
              tone={tone}
              value={format.number(value)}
            />
          ))}
        </Podium>
      </DesignRow>
      <DesignRow label={t('markProgress')}>
        {PATTERN_SPECIMENS.marks.map(({ id, percent, damageToNext }) => (
          <MarkProgress key={id} className={s.mark} damageToNext={damageToNext} percent={percent} title={t(`marks.${id}`)} variant='card' />
        ))}
        <MarkProgress percent={PATTERN_SPECIMENS.doneMark} size={48} />
      </DesignRow>
      <DesignRow label={t('iconFilter')}>
        <IconFilter aria-label={t('tier')} kind='tier' options={PATTERN_SPECIMENS.tiers} value={tiers} onChange={setTiers} />
        <IconFilter aria-label={t('class')} kind='class' options={TANK_CLASSES} value={classes} onChange={setClasses} />
        <IconFilter aria-label={t('nation')} kind='nation' options={NATIONS} size='sm' value={nations} onChange={setNations} />
      </DesignRow>
      {showcase.length > 0 && (
        <DesignRow label={t('showcase')}>
          {showcase.map((row) => (
            <TankShowcaseCard
              key={row.vehicle.tankId}
              figures={[
                { id: 'winRate', label: t('winRate'), value: <WinRateCell digits={1} value={row.winRate} /> },
                { id: 'damage', label: t('damage'), value: format.number(row.avgDamage, { maximumFractionDigits: 0 }) }
              ]}
              className={s.showcase}
              vehicle={row.vehicle}
            />
          ))}
          <TankShowcaseCard
            figures={[
              {
                id: 'damage',
                label: t('damage'),
                value: format.number(showcase[0].avgDamage, { maximumFractionDigits: 0 }),
                delta: PATTERN_SPECIMENS.delta
              }
            ]}
            className={s.showcaseRow}
            layout='row'
            vehicle={showcase[0].vehicle}
          />
        </DesignRow>
      )}
    </DesignBlock>
  );
};
