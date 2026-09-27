export const BATTLE_PASS = {
  stageRange: { min: 0, max: 200, step: 1 },
  pointsRange: { min: 0, max: 1_000, step: 1 },
  pointsPerStageRange: { min: 1, max: 1_000, step: 1 },
  daysRange: { min: 0, max: 120, step: 1 },
  perBattleRange: { min: 0, max: 50, step: 0.5 },
  battlesPerDayRange: { min: 1, max: 100, step: 1 },
  defaults: { stage: 12, stagePoints: 20, pointsPerStage: 50, stages: 50, daysLeft: 30, pointsPerBattle: 6, battlesPerDay: 10 }
} as const;

export const BATTLE_PASS_FIELDS = [
  { key: 'stage', range: BATTLE_PASS.stageRange },
  { key: 'stagePoints', range: BATTLE_PASS.pointsRange },
  { key: 'pointsPerStage', range: BATTLE_PASS.pointsPerStageRange },
  { key: 'stages', range: BATTLE_PASS.stageRange },
  { key: 'daysLeft', range: BATTLE_PASS.daysRange },
  { key: 'pointsPerBattle', range: BATTLE_PASS.perBattleRange }
] as const;
