'use client';

import { useTranslations } from 'next-intl';

import type { UsePinToggleInput } from './use-pin-toggle.types';

import { usePinnedRows } from '../use-pinned-rows';

export const usePinToggle = ({ scope, id, name }: UsePinToggleInput) => {
  const t = useTranslations('common.pin');
  const { isPinned, onToggle } = usePinnedRows(scope);

  const isOn = isPinned(id);

  return { isOn, label: isOn ? t('unpin', { name }) : t('pin', { name }), onToggle: () => onToggle(id) };
};
