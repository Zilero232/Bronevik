'use client';

import { Film } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { BattleMedal } from '@/entities/battle/best-battle';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, RelativeTime } from '@/ui-kit';

import type { BattleRowProps } from './BattleRow.types';

import { TANK_BEST_BATTLES } from '../../../config';

import s from './BattleRow.module.scss';

export const BattleRow = ({ battle }: BattleRowProps) => {
  const t = useTranslations('bestBattles.widget');
  const format = useFormatter();

  return (
    <li className={s.root} data-rank={battle.rank}>
      <span className={s.rank}>{battle.rank}</span>
      <span className={s.who}>
        <Link className={s.name} href={ROUTES.players.profile(battle.nickname)}>
          {battle.nickname}
        </Link>
        <span className={s.meta}>
          {battle.arena?.name ?? t('unknownMap')} · <RelativeTime value={battle.playedAt} />
        </span>
      </span>
      <span className={s.medals}>
        {battle.medals.slice(0, TANK_BEST_BATTLES.medalsInRow).map((medal) => (
          <BattleMedal key={medal.name} medal={medal} size={TANK_BEST_BATTLES.medalSize} />
        ))}
      </span>
      <span className={s.value}>
        <span className={s.number}>{battle.damage === null ? '—' : format.number(battle.damage)}</span>
        <span className={s.unit}>{t('damage')}</span>
      </span>
      {battle.replayId ? (
        <Link
          aria-label={t('replay')}
          className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          href={ROUTES.replays.detail(battle.replayId)}
          title={t('replay')}
        >
          <Film size={14} />
        </Link>
      ) : (
        <span aria-hidden className={s.noReplay} />
      )}
    </li>
  );
};
