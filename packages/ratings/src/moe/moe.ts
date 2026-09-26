import { clamp } from 'remeda';

import type { CurvePoint } from '../interpolation';
import type {
  MoeCombinedDamageInput,
  MoeDamageForPercentInput,
  MoePercentForDamageInput,
  MoeProjection,
  MoeThresholdPercentiles,
  MoeThresholds,
  NextMoeEmaInput,
  ProjectMoeBattlesInput,
  SimulateMoeInput
} from './moe.types';

import { interpolate } from '../interpolation';
import { MOE } from './moe.constants';

export const moeCombinedDamage = ({ damage, spottingAssist, trackingAssist, stunAssist = 0 }: MoeCombinedDamageInput): number =>
  damage + Math.max(spottingAssist, trackingAssist, stunAssist);

export const toMoeThresholds = ({ p65, p85, p95, p100 }: MoeThresholdPercentiles): MoeThresholds => ({
  oneMark: p65,
  twoMarks: p85,
  threeMarks: p95,
  hundredPercent: p100 ?? undefined
});

export const moeMarks = (percent: number): number => MOE.markPercents.filter((mark) => percent >= mark).length;

export const moeAlpha = (emaBattles: number = MOE.emaBattles): number => 2 / (emaBattles + 1);

const curve = (thresholds: MoeThresholds): CurvePoint[] => {
  const { oneMark, twoMarks, threeMarks } = thresholds;
  const [one, two, three] = MOE.markPercents;
  const hundred = thresholds.hundredPercent ?? threeMarks + ((threeMarks - twoMarks) * (MOE.maxPercent - three)) / (three - two);

  if (!(oneMark > 0 && twoMarks > oneMark && threeMarks > twoMarks && hundred > threeMarks)) {
    throw new RangeError('MoE thresholds must be positive and strictly increasing');
  }

  return [
    [0, 0],
    [one, oneMark],
    [two, twoMarks],
    [three, threeMarks],
    [MOE.maxPercent, hundred]
  ];
};

export const moeDamageForPercent = ({ percent, thresholds }: MoeDamageForPercentInput): number =>
  interpolate({ points: curve(thresholds), x: clamp(percent, { min: 0, max: MOE.maxPercent }) });

export const moePercentForDamage = ({ damage, thresholds }: MoePercentForDamageInput): number => {
  const points = curve(thresholds).map(([percent, ema]): CurvePoint => [ema, percent]);

  return damage <= 0 ? 0 : interpolate({ points, x: damage });
};

export const nextMoeEma = ({ ema, combinedDamage, emaBattles }: NextMoeEmaInput): number => ema + moeAlpha(emaBattles) * (combinedDamage - ema);

export const projectMoeBattles = ({
  currentPercent,
  targetPercent,
  averageCombinedDamage,
  thresholds,
  emaBattles
}: ProjectMoeBattlesInput): MoeProjection => {
  const currentEma = moeDamageForPercent({ percent: currentPercent, thresholds });
  const targetEma = moeDamageForPercent({ percent: targetPercent, thresholds });

  if (currentEma >= targetEma) {
    return { battles: 0, currentEma, targetEma };
  }

  if (averageCombinedDamage <= targetEma) {
    return { battles: null, currentEma, targetEma };
  }

  const remaining = (averageCombinedDamage - targetEma) / (averageCombinedDamage - currentEma);
  const battles = Math.ceil(Math.log(remaining) / Math.log(1 - moeAlpha(emaBattles)));

  return { battles, currentEma, targetEma };
};

export const simulateMoe = ({ startPercent, combinedDamages, thresholds, emaBattles }: SimulateMoeInput): number[] => {
  let ema = moeDamageForPercent({ percent: startPercent, thresholds });

  return combinedDamages.map((combinedDamage) => {
    ema = nextMoeEma({ ema, combinedDamage, emaBattles });

    return moePercentForDamage({ damage: ema, thresholds });
  });
};
