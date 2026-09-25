'use client';

import type { Nation } from '@bronevik/icons';

import { NATION_ICONS, NATIONS, TANK_CLASS_ICONS, TANK_CLASSES, TIERS, toRoman } from '@bronevik/icons';
import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, Input, SegmentedControl, Select } from '@/ui-kit';

import type { PremiumFilter } from '../../../../../model/hooks';
import type { TanksFiltersProps } from './TanksFilters.types';

import s from './TanksFilters.module.scss';

const PREMIUM_OPTIONS: readonly PremiumFilter[] = ['all', 'regular', 'premium'];

export const TanksFilters = ({ filters, total }: TanksFiltersProps) => {
  const t = useTranslations('profile.tanks');
  const tGame = useTranslations('game');

  const { filter, isDirty, toggleTier, toggleType, update, reset } = filters;
  const nations = [
    { value: 'all' as const, label: t('allNations') },
    ...NATIONS.map((nation) => {
      const Icon = NATION_ICONS[nation];

      return { value: nation, label: tGame(`nations.${nation}`), icon: <Icon palette='color' size={16} /> };
    })
  ];

  return (
    <div className={s.root}>
      <div className={s.row}>
        <Input
          aria-label={t('search')}
          icon={<Search size={15} />}
          placeholder={t('search')}
          size='sm'
          value={filter.query}
          wrapperClassName={s.search}
          onChange={(event) => update({ query: event.target.value })}
        />
        <Select<'all' | Nation> className={s.nation} items={nations} value={filter.nation} onValueChange={(nation) => update({ nation })} />
        <SegmentedControl<PremiumFilter>
          aria-label={t('premiumLabel')}
          options={PREMIUM_OPTIONS.map((value) => ({ value, label: t(`premium.${value}`) }))}
          size='sm'
          value={filter.premium}
          onChange={(premium) => update({ premium })}
        />
      </div>
      <div className={s.row}>
        <div aria-label={t('tiersLabel')} className={s.chips} role='group'>
          {TIERS.map((tier) => (
            <button key={tier} aria-pressed={filter.tiers.includes(tier)} className={s.chip} type='button' onClick={() => toggleTier(tier)}>
              {toRoman(tier)}
            </button>
          ))}
        </div>
        <div aria-label={t('typesLabel')} className={s.chips} role='group'>
          {TANK_CLASSES.map((type) => {
            const Icon = TANK_CLASS_ICONS[type];

            return (
              <button
                key={type}
                aria-label={tGame(`classes.${type}`)}
                aria-pressed={filter.types.includes(type)}
                className={s.chip}
                title={tGame(`classes.${type}`)}
                type='button'
                onClick={() => toggleType(type)}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
        <span className={s.total}>{t('total', { count: total })}</span>
        {isDirty && (
          <Button size='sm' variant='ghost' onClick={reset}>
            <X size={14} />
            {t('reset')}
          </Button>
        )}
      </div>
    </div>
  );
};
