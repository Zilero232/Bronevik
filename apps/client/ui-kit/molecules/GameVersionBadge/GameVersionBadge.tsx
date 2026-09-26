import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { GameVersionBadgeProps } from './GameVersionBadge.types';

import s from './GameVersionBadge.module.scss';

export const GameVersionBadge = ({ version, className }: GameVersionBadgeProps) => {
  const t = useTranslations('common');

  if (!version) {
    return null;
  }

  return (
    <span className={clsx(s.root, className)} title={t('gameVersionHint')}>
      {t('gameVersion', { version })}
    </span>
  );
};
