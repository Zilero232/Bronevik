'use client';

import { useTranslations } from 'next-intl';

import { specsOfStats, useSpecFormat } from '@/entities/tank/tank';

import { useGuessGame } from '../../context';

export const useClueValues = () => {
  const t = useTranslations('play.clues');
  const spec = useSpecFormat();
  const { target, targetDetail } = useGuessGame();

  const specs = specsOfStats(targetDetail?.stats.top ?? targetDetail?.stats.stock);
  const withUnit = (key: 'maxHealth' | 'shellDamage' | 'shellPenetration') =>
    `${spec.value({ key, value: specs[key] ?? null })} ${spec.unit(key)}`.trim();

  return {
    target,
    shell: t('shellValue', { damage: withUnit('shellDamage'), penetration: withUnit('shellPenetration') }),
    health: withUnit('maxHealth'),
    letter: t('letterValue', { letter: target.name.charAt(0).toUpperCase() })
  };
};
