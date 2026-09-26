import type { MockPlayer, MockTotals, MockVehicle } from '../../lesta-mock.types';
import type { AggregateInput, BattleOdds, MoePercentInput, SimulateBattleInput, SimulatedBattle } from './simulation.types';

import { MOCK_BATTLE, MOCK_MOE, MOCK_SKILL } from '../../config';
import { normalCdf, normalQuantile } from '../random';
import { damageRatio, learningFactor, progressFactor, targetWinRate } from '../skill';
import { emptyTotals } from '../stats';

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const lognormalMedian = (sigma: number): number => Math.exp((-sigma * sigma) / 2);

export const xpBase = (vehicle: MockVehicle): number => MOCK_BATTLE.xpBase[vehicle.tier] ?? MOCK_BATTLE.xpBase[10];

const damageCap = (vehicle: MockVehicle): number =>
  Math.max(vehicle.hp * MOCK_BATTLE.damageCapHp, vehicle.expected.damage * MOCK_BATTLE.damageCapExpected);

const survivalChance = (vehicle: MockVehicle, perf: number, won: boolean): number =>
  clamp(
    MOCK_BATTLE.survival[vehicle.type] + MOCK_BATTLE.survivalPerf * (perf - 1) + (won ? MOCK_BATTLE.survivalWin : MOCK_BATTLE.survivalLoss),
    0.03,
    0.95
  );

const shotsMean = (vehicle: MockVehicle): number => MOCK_BATTLE.shots[vehicle.type] * (0.85 + 0.02 * vehicle.tier);

const accuracy = (vehicle: MockVehicle, perf: number): number => clamp(MOCK_BATTLE.accuracy[vehicle.type] + 0.03 * (perf - 1), 0.4, 0.95);

const penetration = (perf: number): number => clamp(MOCK_BATTLE.penetration + 0.05 * (perf - 1), 0.4, 0.95);

const enemyAlpha = (vehicle: MockVehicle): number => MOCK_BATTLE.enemyAlphaPerTier * vehicle.tier;

const assistNorm = (vehicle: MockVehicle): number => 1 + 0.5 * (MOCK_BATTLE.radioShare[vehicle.type] + MOCK_BATTLE.trackShare[vehicle.type]);

export const combinedExpected = (vehicle: MockVehicle): number =>
  vehicle.expected.damage *
  (1 +
    1.1 * Math.max(MOCK_BATTLE.radioShare[vehicle.type], MOCK_BATTLE.trackShare[vehicle.type], vehicle.type === 'SPG' ? MOCK_BATTLE.stunShare : 0));

export const moePercent = ({ vehicle, ema }: MoePercentInput): number => {
  if (ema <= 0) {
    return 0;
  }

  const z = (Math.log(ema / combinedExpected(vehicle)) - MOCK_SKILL.damageMu) / MOCK_MOE.populationSigma;

  return Math.round(normalCdf(z) * 10_000) / 100;
};

export const moeAlpha = (): number => 2 / (MOCK_MOE.emaBattles + 1);

export const marksFor = (percent: number): number => MOCK_MOE.markPercents.filter((mark) => percent >= mark).length;

export const moeThresholdDamage = (vehicle: MockVehicle, percent: number): number =>
  Math.round(combinedExpected(vehicle) * Math.exp(MOCK_SKILL.damageMu + MOCK_MOE.populationSigma * normalQuantile(percent / 100)));

export const oddsFor = (player: MockPlayer, vehicle: MockVehicle, affinity: number, battlesOnTank: number, at: number): BattleOdds => {
  const learning = learningFactor(battlesOnTank);
  const progress = progressFactor(player, at);

  return {
    perf: damageRatio(player) * affinity * progress * learning,
    winChance: clamp(targetWinRate(player) / 100 + (vehicle.expected.winRate - 51.5) / 200 + (progress - 1) * 0.1 - (1 - learning) * 0.25, 0.25, 0.8)
  };
};

export const baseOddsFor = (player: MockPlayer, vehicle: MockVehicle, affinity: number, battles: number): BattleOdds => {
  const learning =
    battles >= MOCK_SKILL.learningBattles
      ? 1 - (MOCK_SKILL.learningPenalty * MOCK_SKILL.learningBattles) / (2 * battles)
      : 1 - MOCK_SKILL.learningPenalty / 2;

  return {
    perf: damageRatio(player) * affinity * MOCK_SKILL.careerFactor * learning,
    winChance: clamp(targetWinRate(player) / 100 + (vehicle.expected.winRate - 51.5) / 200 - 0.005, 0.25, 0.8)
  };
};

export const simulateBattle = ({
  rng,
  vehicle,
  perf,
  winChance,
  endedAt,
  durationSec,
  mode,
  premiumAccount
}: SimulateBattleInput): SimulatedBattle => {
  const { expected, type } = vehicle;
  const roll = rng.float();
  const result = roll < MOCK_BATTLE.drawChance ? 'draw' : roll < MOCK_BATTLE.drawChance + winChance * (1 - MOCK_BATTLE.drawChance) ? 'win' : 'loss';
  const won = result === 'win';
  const zeroChance = MOCK_BATTLE.zeroDamageChance * (type === 'SPG' ? 0.6 : 1);
  const spread = rng.logNormal(lognormalMedian(MOCK_BATTLE.damageSigma), MOCK_BATTLE.damageSigma) / (1 - zeroChance);
  const damageDealt = rng.chance(zeroChance)
    ? 0
    : Math.round(Math.min(damageCap(vehicle), expected.damage * perf * (won ? MOCK_BATTLE.winDamage : MOCK_BATTLE.lossDamage) * spread));

  const frags = Math.min(
    MOCK_BATTLE.maxFrags,
    rng.poisson(expected.frags * perf ** MOCK_BATTLE.fragPower * (won ? MOCK_BATTLE.winFrags : MOCK_BATTLE.lossFrags))
  );

  const spotted = rng.poisson(expected.spot * perf ** MOCK_BATTLE.spotPower * (won ? MOCK_BATTLE.winSpot : MOCK_BATTLE.lossSpot));
  const droppedCapturePoints = rng.poisson(expected.def * perf ** MOCK_BATTLE.defPower);
  const capturePoints = rng.chance(won ? MOCK_BATTLE.captureChance.win : MOCK_BATTLE.captureChance.loss)
    ? rng.int(MOCK_BATTLE.captureRange[0], MOCK_BATTLE.captureRange[1])
    : 0;

  const survived = rng.chance(survivalChance(vehicle, perf, won));
  const shots = Math.max(damageDealt > 0 ? 1 : 0, rng.poisson(shotsMean(vehicle)));
  const hitChance = accuracy(vehicle, perf);
  const hits = clamp(Math.round(shots * hitChance + rng.normal(0, Math.sqrt(shots * hitChance * (1 - hitChance)))), damageDealt > 0 ? 1 : 0, shots);
  const isArtillery = type === 'SPG';
  const piercings = isArtillery ? 0 : clamp(Math.round(hits * penetration(perf) + rng.normal(0, 0.8)), damageDealt > 0 ? 1 : 0, hits);
  const assistScale = expected.damage * perf ** 0.8;
  const assistedRadio = Math.round(
    assistScale * MOCK_BATTLE.radioShare[type] * rng.logNormal(lognormalMedian(MOCK_BATTLE.assistSigma), MOCK_BATTLE.assistSigma)
  );

  const assistedTrack = Math.round(
    assistScale * MOCK_BATTLE.trackShare[type] * rng.logNormal(lognormalMedian(MOCK_BATTLE.assistSigma), MOCK_BATTLE.assistSigma)
  );

  const stunNumber = isArtillery ? rng.poisson(MOCK_BATTLE.stunCount) : 0;
  const stunAssisted = isArtillery ? Math.round(expected.damage * perf * MOCK_BATTLE.stunShare * rng.logNormal(lognormalMedian(0.7), 0.7)) : 0;
  const damageReceived = survived ? Math.round(vehicle.hp * (0.05 + 0.7 * rng.float())) : Math.round(vehicle.hp * (0.97 + 0.08 * rng.float()));
  const alpha = enemyAlpha(vehicle) * (0.7 + 0.6 * rng.float());
  const noDamageDirectHitsReceived = rng.poisson(MOCK_BATTLE.bounces[type] * (won ? 1.1 : 0.9));
  const directHitsReceived = Math.max(1, Math.round(damageReceived / alpha)) + noDamageDirectHitsReceived;
  const damageBlocked = Math.round(noDamageDirectHitsReceived * alpha * (0.8 + 0.4 * rng.float()));
  const battlePerf = (damageDealt + 0.5 * (assistedRadio + assistedTrack + stunAssisted)) / (expected.damage * assistNorm(vehicle));
  const xp = Math.max(
    1,
    Math.round(
      xpBase(vehicle) * (won ? MOCK_BATTLE.xpWin : 1) * (0.4 + 0.6 * battlePerf) * rng.logNormal(1, MOCK_BATTLE.xpSigma) * (survived ? 1.05 : 0.95)
    )
  );

  return {
    endedAt,
    durationSec,
    lifetimeSec: survived ? durationSec : Math.max(30, Math.round(durationSec * (0.25 + 0.7 * rng.float()))),
    tankId: vehicle.tankId,
    mode,
    result,
    team: rng.int(1, 2),
    damageDealt,
    assistedRadio,
    assistedTrack,
    stunAssisted,
    stunNumber,
    damageBlocked,
    damageReceived,
    frags,
    spotted,
    xp,
    survived,
    shots,
    hits,
    piercings,
    explosionHits: isArtillery ? hits : 0,
    directHitsReceived,
    noDamageDirectHitsReceived,
    capturePoints,
    droppedCapturePoints,
    premiumAccount
  };
};

const scaled = (rng: AggregateInput['rng'], count: number, mean: number, cv: number): number =>
  count === 0 ? 0 : Math.max(0, Math.round(count * mean * (1 + (rng.normal() * cv) / Math.sqrt(count))));

export const aggregateBattles = ({ rng, vehicle, battles, perf, winChance }: AggregateInput): MockTotals => {
  const totals = emptyTotals();

  if (battles <= 0) {
    return totals;
  }

  const { expected, type } = vehicle;
  const pWin = winChance * (1 - MOCK_BATTLE.drawChance);
  const outcome = (win: number, loss: number) => pWin * win + (1 - pWin) * loss;
  const wins = clamp(Math.round(battles * pWin + rng.normal(0, Math.sqrt(battles * pWin * (1 - pWin)))), 0, battles);
  const draws = Math.min(battles - wins, Math.round(battles * MOCK_BATTLE.drawChance));
  const survivalWin = survivalChance(vehicle, perf, true);
  const survivalLoss = survivalChance(vehicle, perf, false);
  const survivedWins = clamp(Math.round(wins * survivalWin), 0, wins);
  const survived = clamp(survivedWins + Math.round((battles - wins) * survivalLoss), 0, battles);
  const shots = scaled(rng, battles, shotsMean(vehicle), 0.3);
  const hits = Math.min(shots, Math.round(shots * accuracy(vehicle, perf)));
  const damageMean = expected.damage * perf * outcome(MOCK_BATTLE.winDamage, MOCK_BATTLE.lossDamage);
  const assistScale = expected.damage * perf ** 0.8;
  const survivalShare = survived / battles;
  const receivedMean = vehicle.hp * (survivalShare * 0.4 + (1 - survivalShare) * 1.01);
  const bounces = MOCK_BATTLE.bounces[type] * outcome(1.1, 0.9);
  const zq = battles <= 1 ? 0 : normalQuantile(1 - 1 / (battles + 1));
  const peak = Math.exp(MOCK_BATTLE.damageSigma * zq - (MOCK_BATTLE.damageSigma * MOCK_BATTLE.damageSigma) / 2) / (1 - MOCK_BATTLE.zeroDamageChance);
  const fragsMean = expected.frags * perf ** MOCK_BATTLE.fragPower * outcome(MOCK_BATTLE.winFrags, MOCK_BATTLE.lossFrags);
  const isArtillery = type === 'SPG';

  totals.battles = battles;
  totals.wins = wins;
  totals.draws = draws;
  totals.losses = battles - wins - draws;
  totals.damageDealt = scaled(rng, battles, damageMean, 0.75);
  totals.frags = scaled(rng, battles, fragsMean, 1);
  totals.spotted = scaled(rng, battles, expected.spot * perf ** MOCK_BATTLE.spotPower * outcome(MOCK_BATTLE.winSpot, MOCK_BATTLE.lossSpot), 1);
  totals.droppedCapturePoints = scaled(rng, battles, expected.def * perf ** MOCK_BATTLE.defPower, 1.2);
  totals.capturePoints = scaled(rng, battles, outcome(MOCK_BATTLE.captureChance.win, MOCK_BATTLE.captureChance.loss) * 52.5, 3);
  totals.survived = survived;
  totals.survivedWins = survivedWins;
  totals.shots = shots;
  totals.hits = hits;
  totals.piercings = isArtillery ? 0 : Math.min(hits, Math.round(hits * penetration(perf)));
  totals.explosionHits = isArtillery ? hits : 0;
  totals.assistedRadio = scaled(rng, battles, assistScale * MOCK_BATTLE.radioShare[type], 0.9);
  totals.assistedTrack = scaled(rng, battles, assistScale * MOCK_BATTLE.trackShare[type], 0.9);
  totals.stunNumber = isArtillery ? scaled(rng, battles, MOCK_BATTLE.stunCount, 0.5) : 0;
  totals.stunAssisted = isArtillery ? scaled(rng, battles, expected.damage * perf * MOCK_BATTLE.stunShare, 0.8) : 0;
  totals.damageReceived = scaled(rng, battles, receivedMean, 0.4);
  totals.noDamageDirectHitsReceived = scaled(rng, battles, bounces, 1);
  totals.directHitsReceived = totals.noDamageDirectHitsReceived + Math.round(totals.damageReceived / enemyAlpha(vehicle));
  totals.piercingsReceived = totals.directHitsReceived - totals.noDamageDirectHitsReceived;
  totals.damageBlocked = Math.round(totals.noDamageDirectHitsReceived * enemyAlpha(vehicle));

  const assistPerBattle = (totals.assistedRadio + totals.assistedTrack + totals.stunAssisted) / battles;
  const battlePerf = (totals.damageDealt / battles + 0.5 * assistPerBattle) / (expected.damage * assistNorm(vehicle));

  totals.xp = Math.round(battles * xpBase(vehicle) * outcome(MOCK_BATTLE.xpWin, 1) * (0.4 + 0.6 * battlePerf) * 1.02);

  totals.maxDamage = Math.min(
    totals.damageDealt,
    Math.round(Math.min(damageCap(vehicle), expected.damage * perf * MOCK_BATTLE.winDamage * Math.max(1, peak)))
  );

  totals.maxFrags = Math.min(
    totals.frags,
    MOCK_BATTLE.maxFrags,
    Math.max(totals.frags > 0 ? 1 : 0, Math.round(fragsMean * 1.3 + zq * Math.sqrt(fragsMean * 1.3)))
  );

  totals.maxXp = Math.min(
    totals.xp,
    Math.round(
      xpBase(vehicle) * MOCK_BATTLE.xpWin * (0.4 + 0.6 * perf * MOCK_BATTLE.winDamage * Math.max(1, peak)) * Math.exp(MOCK_BATTLE.xpSigma * zq * 0.5)
    )
  );

  return totals;
};
