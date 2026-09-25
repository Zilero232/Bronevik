export const MODIFIER_OPS = ['add', 'mul'] as const;

export const STATIC_PREFIX = 'miscAttrs/';

export const STATIC_DEFAULTS = {
  additiveShotDispersionFactor: 1,
  circularVisionRadiusFactor: 1,
  circularVisionRadiusBaseFactor: 1,
  gunReloadTimeFactor: 1,
  gunAimingTimeFactor: 1,
  crewLevelIncrease: 0,
  healthFactor: 1,
  enginePowerFactor: 1,
  turretRotationSpeed: 1,
  invisibilityAdditiveTerm: 0,
  invisibilityMultFactor: 1,
  invisibilityBaseAdditive: 0,
  invisibilityFactorAtShot: 1,
  forwardMaxSpeedKMHTerm: 0,
  backwardMaxSpeedKMHTerm: 0,
  onStillRotationSpeedFactor: 1,
  onMoveRotationSpeedFactor: 1,
  multShotDispersionFactor: 1,
  repairSpeedFactor: 1,
  chassisRepairSpeedFactor: 1,
  fireStartingChanceFactor: 1,
  rollingFrictionFactor: 1,
  'chassis/shotDispersionFactors/movement': 1,
  'chassis/shotDispersionFactors/rotation': 1,
  'gun/shotDispersionFactors/afterShot': 1,
  'gun/shotDispersionFactors/turretRotation': 1,
  'gun/shotDispersionFactors/whileGunDamaged': 1
} as const;

export const FACTOR_DEFAULTS = {
  'engine/power': 1,
  'turret/rotationSpeed': 1,
  'gun/rotationSpeed': 1,
  'gun/reloadTime': 1,
  'gun/aimingTime': 1,
  'engine/fireStartingChance': 1,
  'radio/distance': 1,
  'vehicle/rotationSpeed': 1,
  circularVisionRadius: 1,
  multShotDispersionFactor: 1,
  additiveShotDispersionFactor: 1,
  crewLevelIncrease: 0,
  repairSpeed: 1,
  'invisibility/additive': 0,
  'invisibility/mult': 1
} as const;
