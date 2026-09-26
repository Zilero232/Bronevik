export const LOADOUT_FAMILIES = {
  heavyTank: ['rammer', 'ventilation', 'stabilizer', 'aimdrives', 'healthreserve'],
  mediumTank: ['rammer', 'stabilizer', 'ventilation', 'optics', 'aimdrives', 'turbocharger'],
  lightTank: ['optics', 'turbocharger', 'camouflagenet', 'ventilation', 'stabilizer'],
  'AT-SPG': ['rammer', 'camouflagenet', 'stabilizer', 'aimdrives', 'optics', 'ventilation'],
  SPG: ['rammer', 'aimdrives', 'ventilation', 'stabilizer', 'camouflagenet']
} as const;

export const FAMILY_KEYWORDS = {
  rammer: ['rammer'],
  ventilation: ['ventilation'],
  stabilizer: ['stabilizer'],
  aimdrives: ['aimdrives'],
  healthreserve: ['healthreserve'],
  optics: ['coatedoptics'],
  turbocharger: ['turbocharger'],
  camouflagenet: ['camouflagenet', 'invisibilitydevice']
} as const;

export const CONSUMABLES = {
  basic: ['smallRepairkit', 'smallMedkit', 'handExtinguishers'],
  premium: ['largeRepairkit', 'largeMedkit'],
  third: ['gasoline105', 'gasoline100', 'ration', 'chocolate', 'cocacola', 'hotCoffee', 'autoExtinguishers', 'removedRpmLimiter']
} as const;

export const CREW_PRIORITY = {
  commander: ['commander_sixthSense', 'repair', 'commander_expert', 'brotherhood', 'camouflage', 'commander_eagleEye', 'fireFighting'],
  gunner: ['repair', 'gunner_smoothTurret', 'gunner_sniper', 'brotherhood', 'camouflage', 'gunner_rancorous', 'fireFighting'],
  driver: ['repair', 'driver_smoothDriving', 'driver_virtuoso', 'brotherhood', 'camouflage', 'driver_badRoadsKing', 'fireFighting'],
  radioman: ['repair', 'radioman_finder', 'brotherhood', 'camouflage', 'radioman_lastEffort', 'fireFighting'],
  loader: ['repair', 'loader_pedant', 'loader_intuition', 'brotherhood', 'camouflage', 'loader_desperado', 'fireFighting']
} as const;

export const BONUS_TYPES = { random: 1, ranked: 22, frontline: 27, comp7: 43 } as const;

export const ECONOMY = {
  tierBase: [0, 3500, 5500, 8000, 11_000, 14_500, 18_000, 22_000, 27_000, 31_000, 36_000, 38_000],
  repairFull: [0, 500, 1000, 1800, 2800, 4500, 7000, 10_000, 14_000, 21_000, 31_000, 33_000],
  creditsPerDamage: 6,
  premiumTank: 1.4,
  premiumAccount: 1.5,
  premiumTankRepair: 0.7,
  goldToCredits: 400,
  basicKitPrice: 3000,
  premiumKitPrice: 20_000,
  freeXpShare: 0.05
} as const;

export const BATTLE_ROWS = {
  moeMinTier: 5,
  platoonChance: 0.14
} as const;
