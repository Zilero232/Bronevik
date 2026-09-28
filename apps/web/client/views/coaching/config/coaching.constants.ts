export const COACH_FORM = {
  linkProtocol: /^https$/,
  discordMin: 2,
  contactMax: 128,
  maxTanks: 30,
  bioRows: 5
} as const;

export const COACHING_LIST = {
  pageSize: 20,
  previewTanks: 6
} as const;

export const COACHING_ORDERS = {
  scores: ['1', '2', '3', '4', '5'],
  defaultScore: '5',
  reviewRows: 2
} as const;
