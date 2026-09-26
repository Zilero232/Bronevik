'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Button, Card, FormField, Input, SegmentedControl, Select, TierNumeral, ToggleChips } from '@/ui-kit';

import { PLATOON_BOARD, PLATOON_MODES, PLATOON_TIERS, PLATOON_VOICE } from '../../../config';
import { usePlatoonFilters } from '../../../model/hooks';

import s from './PlatoonFilters.module.scss';

export const PlatoonFilters = () => {
  const t = useTranslations('platoons.filters');
  const tModes = useTranslations('platoons.modes');
  const id = useId();
  const {
    filters,
    isFiltered,
    tierValue,
    modeValue,
    onTiersChange,
    onModeChange,
    onVoiceChange,
    onMinWn8Change,
    onMaxWn8Change,
    onAtChange,
    onReset
  } = usePlatoonFilters();

  return (
    <Card aria-label={t('title')} className={s.root} padding='sm'>
      <ToggleChips
        aria-label={t('tier')}
        options={PLATOON_TIERS.map((tier) => ({ value: tier, label: <TierNumeral tier={Number(tier)} />, title: t('tierTitle', { tier }) }))}
        size='sm'
        value={tierValue}
        onChange={onTiersChange}
      />
      <div className={s.row}>
        <Select
          className={s.select}
          items={[{ value: PLATOON_BOARD.anyMode, label: t('anyMode') }, ...PLATOON_MODES.map((mode) => ({ value: mode, label: tModes(mode) }))]}
          label={t('mode')}
          value={modeValue}
          onValueChange={onModeChange}
        />
        <div className={s.voice}>
          <span className={s.label}>{t('voice')}</span>
          <SegmentedControl
            aria-label={t('voice')}
            options={PLATOON_VOICE.map((value) => ({ value, label: t(`voiceOptions.${value}`) }))}
            size='sm'
            value={filters.voice}
            onChange={onVoiceChange}
          />
        </div>
        <FormField className={s.number} htmlFor={`${id}-min`} label={t('minWn8')}>
          <Input
            id={`${id}-min`}
            inputMode='numeric'
            placeholder='0'
            size='sm'
            value={filters.minWn8 ?? ''}
            onChange={(event) => onMinWn8Change(event.target.value)}
          />
        </FormField>
        <FormField className={s.number} htmlFor={`${id}-max`} label={t('maxWn8')}>
          <Input
            id={`${id}-max`}
            inputMode='numeric'
            placeholder='∞'
            size='sm'
            value={filters.maxWn8 ?? ''}
            onChange={(event) => onMaxWn8Change(event.target.value)}
          />
        </FormField>
        <FormField className={s.time} hint={t('atHint')} htmlFor={`${id}-at`} label={t('at')}>
          <Input id={`${id}-at`} size='sm' type='datetime-local' value={filters.at ?? ''} onChange={(event) => onAtChange(event.target.value)} />
        </FormField>
        {isFiltered && (
          <Button className={s.reset} size='sm' variant='ghost' onClick={onReset}>
            {t('reset')}
          </Button>
        )}
      </div>
    </Card>
  );
};
