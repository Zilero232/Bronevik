export const METRIC_DIGITS = {
  damage: 0,
  frags: 2,
  spotting: 2,
  blocked: 0,
  survival: 1,
  xp: 0,
  accuracy: 1,
  winRate: 1
} as const;

export const PERCENT_METRICS = ['survival', 'accuracy', 'winRate'] as const;

export const CONDITION_MESSAGES = ['win', 'alive'] as const;

export const MISSION_TANKS_VIEW = {
  period: '30d',
  garageLimit: 10
} as const;

export const GARAGE_NOTICE = {
  signIn: 'garageSignIn',
  noLink: 'garageNoLink',
  noPrivateData: 'garageNoPrivateData'
} as const;

export const BRANCH_KEYS = [
  'lightTank',
  'mediumTank',
  'heavyTank',
  'AT-SPG',
  'SPG',
  'Alliance-USSR',
  'Alliance-Germany',
  'Alliance-USA',
  'Alliance-France',
  'LevelGroup1',
  'LevelGroup2',
  'LevelGroup3'
] as const;

export const MISSION_BOARD = {
  classIconSize: 18,
  ringSize: 40,
  headerRingSize: 64,
  ringThickness: 4,
  nodeIconSize: 14,
  showcaseLimit: 6
} as const;
