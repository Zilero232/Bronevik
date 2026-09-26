export const SETTINGS_MENU = {
  id: 'settings',
  channels: ['telegram', 'webPush'],
  events: ['moeGained', 'moeThresholdDropped', 'sessionFinished', 'bonusCode', 'premiumOffer', 'challengeResolved', 'firstWinAvailable'],
  defaultChannels: ['site'],
  defaultEvents: ['moeGained', 'moeThresholdDropped', 'sessionFinished', 'goalReached']
} as const;
