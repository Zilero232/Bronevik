import type { CrewSkill } from '../model';
import type {
  ApplyDevicesInput,
  ApplyDynamicInput,
  ConditionHoldsInput,
  FinalStats,
  LoadoutInput,
  RateOfFireInput,
  RoundInput,
  ShellStats
} from './loadout.types';

import { applyModifier, FACTOR_DEFAULTS, matchesDeviceTags, STATIC_DEFAULTS, STATIC_PREFIX } from '../modifiers';
import { computeCrew, skillAdditive, skillFactor } from './crew';
import { SKILL_EFFECT, VISION } from './loadout.constants';
import { resolveModules } from './modules';

const PHYSICS_PREFIX = 'physics/';

const round = ({ value, digits = 3 }: RoundInput): number => {
  const scale = 10 ** digits;

  return Math.round(value * scale) / scale;
};

const conditionHolds = ({ modifier, vehicle }: ConditionHoldsInput): boolean => {
  if (modifier.condition === 'tracked') {
    return !vehicle.isWheeled;
  }

  if (modifier.condition === 'wheeled') {
    return vehicle.isWheeled;
  }

  return modifier.condition === undefined;
};

const applyStaticModifiers = ({ vehicle, devices, misc, physics }: ApplyDevicesInput): void => {
  for (const { device, specialized } of devices) {
    for (const modifier of device.modifiers) {
      if (!conditionHolds({ modifier, vehicle })) {
        continue;
      }

      if (modifier.attribute.startsWith(STATIC_PREFIX)) {
        applyModifier({ target: misc, modifier: { ...modifier, attribute: modifier.attribute.slice(STATIC_PREFIX.length) }, specialized });
      } else if (modifier.attribute.startsWith(PHYSICS_PREFIX)) {
        applyModifier({ target: physics, modifier: { ...modifier, attribute: modifier.attribute.slice(PHYSICS_PREFIX.length) }, specialized });
      }
    }
  }
};

const applyDynamicModifiers = ({ vehicle, input, misc, factors }: ApplyDynamicInput): void => {
  const state = input.state ?? {};
  const devices = input.optionalDevices ?? [];
  const installedTags = devices.map(({ device }) => device.tags);

  for (const consumable of input.consumables ?? []) {
    for (const modifier of consumable.modifiers) {
      if (modifier.condition === 'active' ? state.consumablesActive : conditionHolds({ modifier, vehicle })) {
        applyModifier({ target: factors, modifier });
      }
    }
  }

  for (const directive of input.directives ?? []) {
    const levelApplied = new Set<string>();

    for (const modifier of directive.modifiers) {
      if (!modifier.requiresDevice) {
        applyModifier({ target: factors, modifier });

        continue;
      }

      if (!levelApplied.has(modifier.attribute) && matchesDeviceTags({ filter: modifier.requiresDevice, installedTags })) {
        levelApplied.add(modifier.attribute);
        applyModifier({ target: factors, modifier });
      }
    }
  }

  if (!state.still) {
    return;
  }

  for (const { device, specialized } of devices) {
    for (const modifier of device.modifiers) {
      if (modifier.condition !== 'still') {
        continue;
      }

      const compensated =
        modifier.attribute === 'circularVisionRadius'
          ? {
              ...modifier,
              value: modifier.value / misc.circularVisionRadiusFactor,
              specValue: modifier.specValue === undefined ? undefined : modifier.specValue / misc.circularVisionRadiusFactor
            }
          : modifier;

      applyModifier({ target: factors, modifier: compensated, specialized });
    }
  }
};

const rateOfFire = ({ reload, clip, autoreload, dualGun }: RateOfFireInput): number => {
  if (dualGun && dualGun.length > 0) {
    return (60 * dualGun.length) / dualGun.reduce((sum, time) => sum + time, 0);
  }

  if (autoreload && autoreload.length > 0 && clip) {
    return (60 * clip.count) / autoreload.reduce((sum, time) => sum + time, 0);
  }

  if (clip) {
    return (60 * clip.count) / (reload + (clip.count - 1) * clip.interval);
  }

  return reload > 0 ? 60 / reload : 0;
};

export const calculateLoadout = (input: LoadoutInput): FinalStats => {
  const { vehicle } = input;
  const modules = resolveModules({ vehicle, modules: input.modules });
  const { chassis, turret, gun, engine, radio, fuelTank } = modules;
  const misc: Record<string, number> = { ...STATIC_DEFAULTS };
  const physics: Record<string, number> = { terrainResistance: 1, rollingFrictionFactor: 1 };
  const factors: Record<string, number> = { ...FACTOR_DEFAULTS };
  const devices = input.optionalDevices ?? [];
  const directives = input.directives ?? [];
  const crewInput = input.crew ?? {};
  const definitions: CrewSkill[] = [...(crewInput.skills ?? []).map((item) => item.skill), ...(crewInput.catalog ?? [])];

  for (const modification of input.fieldModifications ?? []) {
    for (const modifier of modification.modifiers) {
      if (modifier.attribute.startsWith(STATIC_PREFIX)) {
        applyModifier({ target: misc, modifier: { ...modifier, attribute: modifier.attribute.slice(STATIC_PREFIX.length) } });
      }
    }
  }

  applyStaticModifiers({ vehicle, devices, misc, physics });
  applyDynamicModifiers({ vehicle, input, misc, factors });

  const crew = computeCrew({ vehicle, crew: crewInput, directives, crewLevelIncrease: factors.crewLevelIncrease + misc.crewLevelIncrease });
  const skill = (effect: (typeof SKILL_EFFECT)[keyof typeof SKILL_EFFECT]): number =>
    skillFactor({ crew, definitions, skill: effect.skill, params: effect.params });

  factors['gun/reloadTime'] /= crew.factors.loader;
  factors['gun/aimingTime'] /= crew.factors.gunner;
  factors['turret/rotationSpeed'] *= crew.factors.gunner;
  factors['gun/rotationSpeed'] *= crew.factors.gunner;
  factors.circularVisionRadius *= crew.factors.commander;
  factors['radio/distance'] *= crew.factors.radioman;

  const driverResistance = (1 / crew.factors.driver) * physics.terrainResistance;
  const terrainResistance: [number, number, number] = [driverResistance, driverResistance, driverResistance];
  const reloadFactor = misc.gunReloadTimeFactor * factors['gun/reloadTime'];
  const reload = gun.reloadTime * reloadFactor;
  const clip = gun.clip ? { count: gun.clip.count, interval: gun.clip.interval, reloadTime: round({ value: reload }) } : undefined;
  const autoreloadTimes = gun.autoreload?.reloadTimes.map((time) => round({ value: time * reloadFactor }));
  const dualGunReloadTimes = gun.dualGun?.reloadTimes.map((time) => round({ value: time * reloadFactor }));
  const shotsPerMinute = rateOfFire({ reload, clip, autoreload: autoreloadTimes, dualGun: dualGunReloadTimes });
  const additive = misc.additiveShotDispersionFactor * factors.additiveShotDispersionFactor;

  const cvrBonus =
    skillAdditive({ crew, definitions, skill: SKILL_EFFECT.eagleEye.skill, params: SKILL_EFFECT.eagleEye.params }) +
    skillAdditive({ crew, definitions, skill: SKILL_EFFECT.finder.skill, params: SKILL_EFFECT.finder.params });

  const viewRange =
    turret.circularVisionRadius *
    misc.circularVisionRadiusBaseFactor *
    misc.circularVisionRadiusFactor *
    factors.circularVisionRadius *
    (1 + cvrBonus);

  const enginePower = engine.power * misc.enginePowerFactor * factors['engine/power'];
  const weight = (vehicle.hull.weight + chassis.weight + engine.weight + (fuelTank?.weight ?? 0) + radio.weight + turret.weight + gun.weight) / 1000;

  const shells: ShellStats[] = gun.shots.map((shot) => ({
    shell: shot.shell,
    kind: shot.kind,
    caliber: shot.caliber,
    isPremium: shot.isPremium,
    explosionRadius: shot.explosionRadius,
    defaultPortion: shot.defaultPortion,
    speed: shot.speed,
    damage: shot.damage?.armor ?? 0,
    penetration100m: shot.piercingPower.at100m,
    penetration500m: shot.piercingPower.at500m,
    damagePerMinute: round({ value: (shot.damage?.armor ?? 0) * shotsPerMinute, digits: 0 })
  }));

  return {
    modules: { chassis: chassis.name, turret: turret.name, gun: gun.name, engine: engine.name, radio: radio.name, fuelTank: fuelTank?.name },
    moduleIds: [chassis.moduleId, turret.moduleId, gun.moduleId, engine.moduleId, radio.moduleId].filter((id) => id >= 0),
    maxHealth: Math.round((vehicle.hull.maxHealth + (turret.maxHealth ?? 0)) * misc.healthFactor),
    weight: round({ value: weight }),
    enginePower: round({ value: enginePower, digits: 1 }),
    powerToWeight: round({ value: weight > 0 ? enginePower / weight : 0, digits: 2 }),
    speedForward: round({ value: vehicle.speedLimits.forward + misc.forwardMaxSpeedKMHTerm, digits: 2 }),
    speedBackward: round({ value: vehicle.speedLimits.backward + misc.backwardMaxSpeedKMHTerm, digits: 2 }),
    hullTraverse: round({
      value:
        (chassis.rotationSpeed *
          Math.max(misc.onMoveRotationSpeedFactor, misc.onStillRotationSpeedFactor) *
          factors['vehicle/rotationSpeed'] *
          skill(SKILL_EFFECT.virtuoso)) /
        driverResistance,
      digits: 2
    }),
    turretTraverse: round({ value: turret.rotationSpeed * factors['turret/rotationSpeed'] * misc.turretRotationSpeed, digits: 2 }),
    viewRange: round({ value: Math.min(viewRange, VISION.maxRadius), digits: 1 }),
    viewRangeUncapped: round({ value: viewRange, digits: 1 }),
    radioRange: round({ value: radio.distance * factors['radio/distance'] * skill(SKILL_EFFECT.inventor), digits: 1 }),
    reloadTime: round({ value: reload }),
    rateOfFire: round({ value: shotsPerMinute, digits: 2 }),
    clip,
    autoreloadTimes,
    dualGunReloadTimes,
    aimingTime: round({ value: gun.aimingTime * misc.gunAimingTimeFactor * factors['gun/aimingTime'] }),
    dispersion: round({
      value: (gun.shotDispersionRadius * misc.multShotDispersionFactor * factors.multShotDispersionFactor) / crew.factors.gunner,
      digits: 4
    }),
    dispersionMovement: round({
      value: chassis.shotDispersionFactors.movement * misc['chassis/shotDispersionFactors/movement'] * additive * skill(SKILL_EFFECT.smoothDriving),
      digits: 4
    }),
    dispersionHullRotation: round({
      value: chassis.shotDispersionFactors.rotation * misc['chassis/shotDispersionFactors/rotation'] * additive,
      digits: 4
    }),
    dispersionTurretRotation: round({
      value:
        gun.shotDispersionFactors.turretRotation * misc['gun/shotDispersionFactors/turretRotation'] * additive * skill(SKILL_EFFECT.smoothTurret),
      digits: 4
    }),
    dispersionAfterShot: round({ value: gun.shotDispersionFactors.afterShot * misc['gun/shotDispersionFactors/afterShot'], digits: 4 }),
    elevation: gun.pitchLimits?.elevation,
    depression: gun.pitchLimits?.depression,
    shells,
    crew,
    staticAttributes: misc,
    factors,
    terrainResistance
  };
};
