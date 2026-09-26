import { useTranslations } from 'next-intl';

import type { CosmeticNameProps } from './CosmeticName.types';

import { cosmeticLabel } from '../../lib/cosmetic-look';

export const CosmeticName = ({ code }: CosmeticNameProps) => {
  const t = useTranslations('cosmetics');
  const label = cosmeticLabel(code);

  if (label === null) {
    return null;
  }

  return label.kind === 'static'
    ? t(`items.${label.code}`)
    : t('seasonItem', { season: label.season.toUpperCase(), slot: label.slot, grade: label.grade });
};
