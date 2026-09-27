'use client';

import { useTranslations } from 'next-intl';

import { OVERLAY_OPTIONS } from '@/entities/streamer/overlay';
import { usePlus } from '@/features/plus/plus-gate';

export const useOverlayThemes = () => {
  const t = useTranslations('streamer.overlays');
  const { isPlus } = usePlus();

  return {
    isPlus,
    standard: OVERLAY_OPTIONS.themes.map((theme) => ({ value: theme, label: t(`theme.${theme}`) })),
    premium: OVERLAY_OPTIONS.premiumThemes.map((theme) => ({ value: theme, label: t(`theme.${theme}`) }))
  };
};
