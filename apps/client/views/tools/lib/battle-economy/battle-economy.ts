import type { BattleEconomy, BattleEconomyInput } from './battle-economy.types';

import { ECONOMY, ECONOMY_TIERS } from '../../config';

export const battleEconomy = ({ tier, isPremiumVehicle, damage, spotting, shells, prices, consumables }: BattleEconomyInput): BattleEconomy => {
  const rates = ECONOMY_TIERS[tier] ?? ECONOMY_TIERS[10];
  const vehicle = isPremiumVehicle ? ECONOMY.premiumVehicle : { income: 1, repair: 1 };
  const gross = Math.round((rates.base + damage * rates.perDamage + spotting * rates.perSpotting) * vehicle.income);
  const repair = Math.round(rates.repair * vehicle.repair);
  const ammo = shells.ap * prices.ap + shells.heat * prices.heat + shells.he * prices.he;
  const consumableCost = consumables.standard * ECONOMY.consumablePrice.standard + consumables.premium * ECONOMY.consumablePrice.premium;
  const grossPremium = Math.round(gross * ECONOMY.premiumAccount);
  const costs = repair + ammo + consumableCost;

  return {
    gross,
    grossPremium,
    repair,
    ammo,
    consumables: consumableCost,
    net: gross - costs,
    netPremium: grossPremium - costs
  };
};

export const defaultShellPrices = (tier: number): BattleEconomyInput['prices'] => {
  const { ap, heat, he } = ECONOMY_TIERS[tier] ?? ECONOMY_TIERS[10];

  return { ap, heat, he };
};
