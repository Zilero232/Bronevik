import type { BonusOfInput, EconomyView, EconomyViewInput } from './economy-view.types';

import { ECONOMY_VIEW } from '../../config';

const sumOrNull = (values: readonly (number | null)[]): number | null =>
  values.every((value) => value !== null) ? values.reduce<number>((total, value) => total + (value ?? 0), 0) : null;

const bonusOf = ({ creditsBase, withReserve, withClanPayout }: BonusOfInput): number => {
  if (creditsBase === null) {
    return 0;
  }

  const rate = (withReserve ? ECONOMY_VIEW.reserveBonus : 0) + (withClanPayout ? ECONOMY_VIEW.clanPayoutBonus : 0);

  return Math.round(creditsBase * rate);
};

export const economyView = ({ economy, account, withReserve, withClanPayout = false }: EconomyViewInput): EconomyView | null => {
  const figures = economy[account];

  if (!figures) {
    return null;
  }

  const bonus = bonusOf({ creditsBase: figures.creditsBase, withReserve, withClanPayout });

  return {
    battles: figures.battles,
    players: figures.players,
    credits: figures.credits === null ? null : figures.credits + bonus,
    net: figures.net === null ? null : figures.net + bonus,
    costs: sumOrNull([figures.repair, figures.ammo, figures.consumables]),
    repair: figures.repair,
    ammo: figures.ammo,
    consumables: figures.consumables,
    xp: figures.xp,
    freeXp: figures.freeXp
  };
};
