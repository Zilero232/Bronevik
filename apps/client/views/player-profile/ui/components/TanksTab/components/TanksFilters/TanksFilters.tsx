'use client';

import type { Nation, TankClass } from '@otmetki/icons';

import { NATION_ICONS, NATIONS, TANK_CLASS_ICONS, TANK_CLASSES, TIERS, toRoman } from '@otmetki/icons';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, Input, SegmentedControl, Select, ToggleChips } from '@/ui-kit';

import type { PremiumFilter } from '../../../../../lib/tanks-filter';
import type { TanksFiltersProps } from './TanksFilters.types';

import { TANKS_FILTER } from '../../../../../config';

import s from './TanksFilters.module.scss';

export const TanksFilters = ({ filters, total }: TanksFiltersProps) => {
  const t = useTranslations('profile.tanks');
  const tGame = useTranslations('game');

  const { filter, isDirty, setTiers, setTypes, update, reset } = filters;

  return (
    <div className={s.root}>
      <Input
        aria-label={t('search')}
        icon={<Search size={14} />}
        placeholder={t('search')}
        size='sm'
        value={filter.query}
        wrapperClassName={s.search}
        onChange={(event) => update({ query: event.target.value })}
      />
      <ToggleChips
        aria-label={t('tiersLabel')}
        options={TIERS.map((tier) => ({ value: String(tier), label: toRoman(tier) }))}
        size='sm'
        value={filter.tiers.map(String)}
        onChange={setTiers}
      />
      <ToggleChips<TankClass>
        options={TANK_CLASSES.map((type) => {
          const Icon = TANK_CLASS_ICONS[type];

          return { value: type, label: <Icon size={16} />, title: tGame(`classes.${type}`) };
        })}
        aria-label={t('typesLabel')}
        size='sm'
        value={filter.types}
        onChange={setTypes}
      />
      <Select<'all' | Nation>
        items={[
          { value: 'all', label: t('allNations') },
          ...NATIONS.map((nation) => {
            const Icon = NATION_ICONS[nation];

            return { value: nation, label: tGame(`nations.${nation}`), icon: <Icon palette='color' size={16} /> };
          })
        ]}
        aria-label={t('nationLabel')}
        className={s.nation}
        value={filter.nation}
        onValueChange={(nation) => update({ nation })}
      />
      <SegmentedControl<PremiumFilter>
        aria-label={t('premiumLabel')}
        options={TANKS_FILTER.premiumOptions.map((value) => ({ value, label: t(`premium.${value}`) }))}
        size='sm'
        value={filter.premium}
        onChange={(premium) => update({ premium })}
      />
      <span className={s.total}>{t('total', { count: total })}</span>
      {isDirty && (
        <Button size='sm' variant='ghost' onClick={reset}>
          {t('reset')}
        </Button>
      )}
    </div>
  );
};
