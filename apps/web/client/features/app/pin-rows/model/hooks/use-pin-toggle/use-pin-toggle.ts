'use client';

import { useTranslations } from 'next-intl';

import type { UsePinToggleInput } from './use-pin-toggle.types';

import { togglePinned } from '../../../lib/pinned-store';

export const usePinToggle = ({ scope, id, name, isOn }: UsePinToggleInput) => {
  const t = useTranslations('common.pin');

  return { label: isOn ? t('unpin', { name }) : t('pin', { name }), onToggle: () => togglePinned({ scope, id }) };
};
