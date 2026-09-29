'use client';

import type { KeyboardEvent } from 'react';

import { useRef } from 'react';

import type { TierPickInput, UseTierPickerInput } from './use-tier-picker.types';

import { nextTierSelection, tierRuns } from '../tier-selection';

export const useTierPicker = ({ options, value, mode, isRequired, onChange }: UseTierPickerInput) => {
  const anchorRef = useRef<number | null>(null);
  const shiftRef = useRef(false);

  const runs = tierRuns({ options, value });

  const onPick = ({ tier, isRange }: TierPickInput) => {
    onChange(nextTierSelection({ options, value, tier, anchor: anchorRef.current, isRange: isRange || shiftRef.current, mode, isRequired }));
    anchorRef.current = tier;
    shiftRef.current = false;
  };

  return {
    runs,
    selected: value.map(String),
    onPick,
    onKeyDown: (event: KeyboardEvent) => {
      shiftRef.current = event.shiftKey;
    }
  };
};
