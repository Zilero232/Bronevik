export const REPLAY_PARSE = {
  trackStepSeconds: 1,
  maxErrorLength: 500,
  moscowOffset: '+03:00'
} as const;

export const REPLAY_MEDALS = {
  masteryBadges: [
    { level: 4, name: 'markOfMastery' },
    { level: 3, name: 'markOfMasteryI' },
    { level: 2, name: 'markOfMasteryII' },
    { level: 1, name: 'markOfMasteryIII' }
  ]
} as const;
