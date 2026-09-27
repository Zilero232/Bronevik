import type { MockPlayer } from '../../lesta-mock.types';
import type { ProgressFactorInput } from './skill.types';

import { MOCK_SKILL, MOCK_TIME } from '../../config';

const YEAR_SEC = 365.25 * MOCK_TIME.daySec;

export const damageRatio = (player: Pick<MockPlayer, 'skill'>): number => Math.exp(MOCK_SKILL.damageMu + MOCK_SKILL.damageSigma * player.skill);

export const targetWinRate = (player: Pick<MockPlayer, 'winSkill'>): number => {
  const tail = Math.max(0, player.winSkill - MOCK_SKILL.winTailFrom);
  const value = MOCK_SKILL.winMean + MOCK_SKILL.winSigma * player.winSkill + MOCK_SKILL.winTailScale * tail * tail;

  return Math.min(MOCK_SKILL.winMax, Math.max(MOCK_SKILL.winMin, value));
};

export const progressFactor = ({ player, at }: ProgressFactorInput): number => Math.max(0.8, 1 + player.drift * ((at - MOCK_TIME.anchor) / YEAR_SEC));

export const learningFactor = (battlesOnTank: number): number =>
  battlesOnTank >= MOCK_SKILL.learningBattles ? 1 : 1 - MOCK_SKILL.learningPenalty * (1 - battlesOnTank / MOCK_SKILL.learningBattles);
