'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { TIERS, toRoman } from '@otmetki/icons';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { tierBand, useTierPicker } from '@/shared/lib';

import type { TierPickerProps } from './TierPicker.types';

import s from './TierPicker.module.scss';

export const TierPicker = ({
  value,
  options = TIERS,
  mode = 'multiple',
  isRequired = false,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  onChange
}: TierPickerProps) => {
  const t = useTranslations('common');
  const { runs, selected, onPick, onKeyDown } = useTierPicker({ options, value, mode, isRequired, onChange });

  return (
    <ToggleGroup
      aria-label={ariaLabel}
      className={clsx(s.root, s[size], className)}
      multiple={mode === 'multiple'}
      value={selected}
      onKeyDown={onKeyDown}
    >
      {options.map((tier) => (
        <Toggle
          key={tier}
          aria-label={t('tier', { tier })}
          className={s.chip}
          data-run={runs.get(tier)}
          data-tier-band={tierBand(tier)}
          title={t('tier', { tier })}
          value={String(tier)}
          onClick={(event) => onPick({ tier, isRange: event.shiftKey })}
        >
          {toRoman(tier)}
        </Toggle>
      ))}
    </ToggleGroup>
  );
};
