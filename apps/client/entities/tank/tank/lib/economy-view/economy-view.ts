import type { EconomyView, EconomyViewInput } from './economy-view.types';

import { ECONOMY_VIEW } from '../../config';

const sumOrNull = (values: readonly (number | null)[]): number | null =>
  values.every((value) => value !== null) ? values.reduce<number>((total, value) => total + (value ?? 0), 0) : null;

export const economyView = ({ economy, account, withReserve }: EconomyViewInput): EconomyView | null => {
  const figures = economy[account];

  if (!figures) {
    return null;
  }

  const reserve = withReserve && figures.creditsBase !== null ? Math.round(figures.creditsBase * ECONOMY_VIEW.reserveBonus) : 0;

  return {
    battles: figures.battles,
    players: figures.players,
    credits: figures.credits === null ? null : figures.credits + reserve,
    net: figures.net === null ? null : figures.net + reserve,
    costs: sumOrNull([figures.repair, figures.ammo, figures.consumables]),
    repair: figures.repair,
    ammo: figures.ammo,
    consumables: figures.consumables,
    xp: figures.xp,
    freeXp: figures.freeXp
  };
};
