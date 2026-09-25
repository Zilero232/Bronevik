import type { CrewSkill } from '../model';
import type {
  ApplyDevicesInput,
  ApplyDynamicInput,
  ConditionHoldsInput,
  FinalStats,
  LoadoutInput,
  RateOfFireInput,
  ShellStats
} from './loadout.types';

import { applyModifier, FACTOR_DEFAULTS, matchesDeviceTags, STATIC_DEFAULTS, STATIC_PREFIX } from '../modifiers';
import { computeCrew, skillAdditive, skillFactor } from './crew';
import { SKILL_EFFECT, VISION } from './loadout.constants';
import { resolveModules } from './modules';

const PHYSICS_PREFIX = 'physics/';

const round = (value: number, digits = 3): number => {
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
  const clip = gun.clip ? { count: gun.clip.count, interval: gun.clip.interval, reloadTime: round(reload) } : undefined;
  const autoreloadTimes = gun.autoreload?.reloadTimes.map((time) => round(time * reloadFactor));
  const dualGunReloadTimes = gun.dualGun?.reloadTimes.map((time) => round(time * reloadFactor));
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
    damagePerMinute: round((shot.damage?.armor ?? 0) * shotsPerMinute, 0)
  }));

  return {
    modules: { chassis: chassis.name, turret: turret.name, gun: gun.name, engine: engine.name, radio: radio.name, fuelTank: fuelTank?.name },
    moduleIds: [chassis.moduleId, turret.moduleId, gun.moduleId, engine.moduleId, radio.moduleId].filter((id) => id >= 0),
    maxHealth: Math.round((vehicle.hull.maxHealth + (turret.maxHealth ?? 0)) * misc.healthFactor),
    weight: round(weight),
    enginePower: round(enginePower, 1),
    powerToWeight: round(weight > 0 ? enginePower / weight : 0, 2),
    speedForward: round(vehicle.speedLimits.forward + misc.forwardMaxSpeedKMHTerm, 2),
    speedBackward: round(vehicle.speedLimits.backward + misc.backwardMaxSpeedKMHTerm, 2),
    hullTraverse: round(
      (chassis.rotationSpeed *
        Math.max(misc.onMoveRotationSpeedFactor, misc.onStillRotationSpeedFactor) *
        factors['vehicle/rotationSpeed'] *
        skill(SKILL_EFFECT.virtuoso)) /
        driverResistance,
      2
    ),
    turretTraverse: round(turret.rotationSpeed * factors['turret/rotationSpeed'] * misc.turretRotationSpeed, 2),
    viewRange: round(Math.min(viewRange, VISION.maxRadius), 1),
    viewRangeUncapped: round(viewRange, 1),
    radioRange: round(radio.distance * factors['radio/distance'] * skill(SKILL_EFFECT.inventor), 1),
    reloadTime: round(reload),
    rateOfFire: round(shotsPerMinute, 2),
    clip,
    autoreloadTimes,
    dualGunReloadTimes,
    aimingTime: round(gun.aimingTime * misc.gunAimingTimeFactor * factors['gun/aimingTime']),
    dispersion: round((gun.shotDispersionRadius * misc.multShotDispersionFactor * factors.multShotDispersionFactor) / crew.factors.gunner, 4),
    dispersionMovement: round(
      chassis.shotDispersionFactors.movement * misc['chassis/shotDispersionFactors/movement'] * additive * skill(SKILL_EFFECT.smoothDriving),
      4
    ),
    dispersionHullRotation: round(chassis.shotDispersionFactors.rotation * misc['chassis/shotDispersionFactors/rotation'] * additive, 4),
    dispersionTurretRotation: round(
      gun.shotDispersionFactors.turretRotation * misc['gun/shotDispersionFactors/turretRotation'] * additive * skill(SKILL_EFFECT.smoothTurret),
      4
    ),
    dispersionAfterShot: round(gun.shotDispersionFactors.afterShot * misc['gun/shotDispersionFactors/afterShot'], 4),
    elevation: gun.pitchLimits?.elevation,
    depression: gun.pitchLimits?.depression,
    shells,
    crew,
    staticAttributes: misc,
    factors,
    terrainResistance
  };
};
