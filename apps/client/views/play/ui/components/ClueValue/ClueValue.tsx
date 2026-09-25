'use client';

import { isNation, NATION_ICONS, toRoman } from '@bronevik/icons';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { specsOfStats, useSpecFormat } from '@/entities/tank/tank';

import type { ClueValueProps } from './ClueValue.types';

import { useGuessGame } from '../../../model/context';

import s from './ClueValue.module.scss';

export const ClueValue = ({ clue }: ClueValueProps) => {
  const t = useTranslations('play.clues');
  const tNations = useTranslations('game.nations');
  const spec = useSpecFormat();
  const { target, targetDetail } = useGuessGame();

  const specs = specsOfStats(targetDetail?.stats.top ?? targetDetail?.stats.stock);
  const specValue = (key: 'maxHealth' | 'shellDamage' | 'shellPenetration') =>
    `${spec.value({ key, value: specs[key] ?? null })} ${spec.unit(key)}`.trim();

  return match(clue)
    .with('tier', () => <span className={s.big}>{toRoman(target.tier)}</span>)
    .with('nation', () => {
      if (!isNation(target.nation)) {
        return <span>{target.nation}</span>;
      }

      const Icon = NATION_ICONS[target.nation];

      return (
        <span className={s.inline}>
          <Icon aria-hidden palette='color' size={22} />
          {tNations(target.nation)}
        </span>
      );
    })
    .with('shell', () => <span>{t('shellValue', { damage: specValue('shellDamage'), penetration: specValue('shellPenetration') })}</span>)
    .with('health', () => <span>{specValue('maxHealth')}</span>)
    .with('letter', () => <span className={s.big}>{t('letterValue', { letter: target.name.charAt(0).toUpperCase() })}</span>)
    .exhaustive();
};
