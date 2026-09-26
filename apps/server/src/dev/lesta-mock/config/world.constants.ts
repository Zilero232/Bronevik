export const MOCK_TIME = {
  zoneOffsetSec: 3 * 3600,
  daySec: 86_400,
  anchor: Date.UTC(2025, 7, 31, 21, 0, 0) / 1000,
  horizonDays: 480
} as const;

export const MOCK_WORLD = {
  seed: 20_100_812,
  players: 12_000,
  clans: 260,
  firstAccountAt: Date.UTC(2010, 7, 12) / 1000,
  lastAccountAt: Date.UTC(2025, 6, 20) / 1000,
  earlyShare: 0.55,
  earlyUntil: Date.UTC(2015, 11, 31) / 1000,
  accountIdKnots: [
    [Date.UTC(2010, 7, 12) / 1000, 12_000],
    [Date.UTC(2011, 11, 31) / 1000, 7_400_000],
    [Date.UTC(2013, 11, 31) / 1000, 21_000_000],
    [Date.UTC(2016, 11, 31) / 1000, 41_000_000],
    [Date.UTC(2019, 11, 31) / 1000, 62_000_000],
    [Date.UTC(2022, 11, 31) / 1000, 86_000_000],
    [Date.UTC(2025, 6, 20) / 1000, 108_000_000]
  ],
  clanIdBase: 1_000_000,
  clanIdStep: [60, 5200]
} as const;

export const MOCK_SKILL = {
  damageMu: -0.21,
  damageSigma: 0.31,
  ageBoostPerYear: 0.012,
  winMean: 49,
  winSigma: 3,
  winTailFrom: 1.8,
  winTailScale: 2.5,
  winMin: 38,
  winMax: 72,
  winCorrelation: 0.9,
  driftMean: 0.03,
  driftSigma: 0.05,
  careerFactor: 0.93,
  affinitySigma: 0.12,
  learningBattles: 40,
  learningPenalty: 0.14
} as const;

export const MOCK_ACTIVITY = {
  shares: { regular: 0.55, casual: 0.2, lapsed: 0.25 },
  dayChance: { regular: [0.3, 0.75], casual: [0.05, 0.2], lapsed: [0, 0.004] },
  sessionMedian: { regular: 14, casual: 7, lapsed: 5 },
  sessionSigma: 0.55,
  maxSessionBattles: 70,
  weekday: [1.2, 0.9, 0.9, 0.92, 0.95, 1.02, 1.28],
  weekendSession: 1.3,
  breakChance: 0.1,
  breakFactor: 0.08,
  chronotypes: [
    { share: 0.7, mean: 20, sigma: 1.4 },
    { share: 0.18, mean: 14.5, sigma: 2.2 },
    { share: 0.12, mean: 23.3, sigma: 0.9 }
  ],
  weekendHourMean: 15.5,
  weekendHourSigma: 3.2,
  sessionHourJitter: 1.1,
  earliestHour: 7,
  latestHour: 25.5,
  battleIntervalSec: [290, 560],
  pauseEvery: 11,
  pauseSec: [600, 2400],
  rotationSize: [1, 6],
  focusBoost: 3,
  lapsedGapDays: [35, 2400],
  regularGapDays: [0, 3],
  casualGapDays: [2, 25]
} as const;

export const MOCK_CAREER = {
  battlesMedian: 5200,
  battlesSigma: 1.05,
  battlesPerDayCap: 25,
  minBattles: 40,
  ageMedianYears: 7,
  premiumShare: [0.05, 0.95]
} as const;

export const MOCK_GARAGE = {
  linesBase: 1,
  linesPerBattles: 2600,
  linesSigma: 1.1,
  maxLines: 32,
  tierSaturation: 6000,
  tierSigma: 1.3,
  secondBranchFrom: 15_000,
  secondBranchChance: 0.35,
  starters: [2, 4],
  starterBattles: [6, 45],
  premiumsPer: 1500,
  maxPremiums: 70,
  collectiblePer: 5000,
  grindBase: 8,
  grindScale: 5,
  grindPower: 1.45,
  grindSigma: 0.4,
  minPlayedShare: 0.25,
  preferenceSigma: 0.9,
  grindWeight: 0.04,
  unlockChance: 0.3,
  otherShare: [0.02, 0.09],
  otherMinTier: 8,
  nationWeights: {
    ussr: 1.6,
    germany: 1.5,
    usa: 1.2,
    france: 0.9,
    uk: 0.9,
    china: 0.7,
    japan: 0.5,
    czech: 0.5,
    sweden: 0.6,
    poland: 0.6,
    italy: 0.5,
    intunion: 0.35
  },
  typeWeights: { heavyTank: 1.3, mediumTank: 1.3, 'AT-SPG': 0.9, lightTank: 0.6, SPG: 0.35 },
  premiumTierWeights: [0, 0.01, 0.02, 0.03, 0.03, 0.05, 0.07, 0.08, 0.55, 0.08, 0.03, 0.02],
  tierComfort: [0, 0.05, 0.08, 0.1, 0.14, 0.2, 0.3, 0.38, 0.95, 0.65, 1, 1]
} as const;

export const MOCK_BATTLE = {
  drawChance: 0.008,
  zeroDamageChance: 0.07,
  damageSigma: 0.5,
  winDamage: 1.18,
  lossDamage: 0.84,
  damageCapHp: 4,
  damageCapExpected: 5,
  winFrags: 1.3,
  lossFrags: 0.72,
  fragPower: 0.9,
  maxFrags: 15,
  spotPower: 0.6,
  winSpot: 1.1,
  lossSpot: 0.9,
  defPower: 0.5,
  captureChance: { win: 0.06, loss: 0.015 },
  captureRange: [5, 100],
  survival: { lightTank: 0.3, mediumTank: 0.32, heavyTank: 0.3, 'AT-SPG': 0.36, SPG: 0.55 },
  survivalPerf: 0.18,
  survivalWin: 0.22,
  survivalLoss: -0.14,
  shots: { lightTank: 10, mediumTank: 11, heavyTank: 9, 'AT-SPG': 8.5, SPG: 7 },
  accuracy: { lightTank: 0.76, mediumTank: 0.78, heavyTank: 0.74, 'AT-SPG': 0.82, SPG: 0.62 },
  penetration: 0.72,
  radioShare: { lightTank: 0.95, mediumTank: 0.35, heavyTank: 0.18, 'AT-SPG': 0.25, SPG: 0.05 },
  trackShare: { lightTank: 0.12, mediumTank: 0.15, heavyTank: 0.15, 'AT-SPG': 0.12, SPG: 0.25 },
  assistSigma: 0.9,
  bounces: { lightTank: 0.6, mediumTank: 1.8, heavyTank: 3.2, 'AT-SPG': 1.6, SPG: 0.2 },
  enemyAlphaPerTier: 42,
  xpBase: [0, 150, 190, 240, 290, 350, 410, 480, 560, 640, 730, 780],
  xpWin: 1.5,
  xpSigma: 0.2,
  stunCount: 4,
  stunShare: 0.45,
  durationSec: [170, 900],
  hpFallback: {
    lightTank: [0, 120, 200, 300, 420, 550, 750, 950, 1150, 1350, 1600, 1700],
    mediumTank: [0, 140, 230, 340, 470, 650, 900, 1150, 1450, 1750, 2000, 2100],
    heavyTank: [0, 160, 260, 380, 520, 760, 1050, 1350, 1700, 2050, 2400, 2500],
    'AT-SPG': [0, 130, 210, 310, 440, 620, 850, 1100, 1400, 1700, 2000, 2100],
    SPG: [0, 100, 150, 210, 280, 340, 420, 520, 620, 800, 1000, 1100]
  }
} as const;

export const MOCK_MOE = {
  emaBattles: 100,
  populationSigma: 0.37,
  markPercents: [65, 85, 95],
  lucky: 1.12
} as const;

export const MOCK_OTHER_MODES = {
  clanTierShare: { top: 0.08, mid: 0.05, small: 0.02 },
  modes: ['comp7', 'ranked', 'frontline'],
  weights: [0.55, 0.2, 0.25]
} as const;

export const MOCK_CACHE = {
  garages: 4000,
  states: 1500,
  rankingsTtlSec: 3600
} as const;

export const MOCK_SALT = {
  accounts: 1,
  player: 2,
  nickname: 3,
  clans: 4,
  clan: 5,
  membership: 6,
  garage: 7,
  day: 8,
  battle: 9,
  base: 10,
  affinity: 11,
  week: 12,
  online: 13,
  token: 14,
  achievements: 15,
  elo: 16,
  loadout: 17,
  economy: 18,
  arena: 19,
  stronghold: 20
} as const;

export const MOCK_CLANS = {
  tiers: { top: 10, mid: 70 },
  academies: 8,
  size: { top: [80, 100], mid: [20, 55], small: [4, 22] },
  joinChance: { active: 0.55, lapsed: 0.15 },
  headSkip: 0.3,
  createdFrom: Date.UTC(2011, 0, 1) / 1000,
  createdTo: Date.UTC(2024, 5, 1) / 1000,
  windowJoinShare: 0.12,
  leaveChance: 0.07,
  hopChance: 0.5,
  pastStintChance: 0.25,
  clanlessPastChance: 0.2,
  renameChance: 0.08,
  officers: {
    executive_officer: [1, 2],
    personnel_officer: [1, 1],
    combat_officer: [1, 3],
    intelligence_officer: [0, 1],
    quartermaster: [0, 1],
    recruitment_officer: [1, 1]
  },
  juniorShare: 0.1,
  recruitShare: 0.05,
  reservistShare: 0.05,
  stronghold: { top: [10, 10], mid: [5, 10], small: [1, 6] },
  globalMapChance: { top: 1, mid: 0.3, small: 0.02 },
  elo: { top: [1350, 1850], mid: [950, 1400], small: [850, 1100] },
  eloDrift: 9
} as const;
