import { BATTLE_PASS } from '../../../config';

export const BATTLE_PASS_FIELDS = [
  { key: 'stage', range: BATTLE_PASS.stageRange },
  { key: 'stagePoints', range: BATTLE_PASS.pointsRange },
  { key: 'pointsPerStage', range: BATTLE_PASS.pointsPerStageRange },
  { key: 'stages', range: BATTLE_PASS.stageRange },
  { key: 'daysLeft', range: BATTLE_PASS.daysRange },
  { key: 'pointsPerBattle', range: BATTLE_PASS.perBattleRange }
] as const;
