'use client';

import { useTranslations } from 'next-intl';

import { isMapCamouflage, mapModeKind } from '../../../lib/map-mode';

export const useMapLabels = () => {
  const t = useTranslations('maps');

  return {
    mode: (mode: string) => {
      const kind = mapModeKind(mode);

      return kind ? t(`modes.${kind}`) : mode;
    },
    name: (name: string | null | undefined) => name ?? t('unnamed'),
    camouflage: (camouflage: string) => (isMapCamouflage(camouflage) ? t(`camouflage.${camouflage}`) : camouflage)
  };
};
