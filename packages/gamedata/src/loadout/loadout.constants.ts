export const CREW = {
  maxLevel: 100,
  baseFactor: 0.57,
  levelFactor: 0.43,
  commanderAdditionRatio: 10
} as const;

export const VISION = {
  maxRadius: 445
} as const;

export const SKILL_EFFECT = {
  smoothTurret: { skill: 'gunner_smoothTurret', params: ['turretAimingDispersion'] },
  smoothDriving: { skill: 'driver_smoothDriving', params: ['vehicleGunShotDispersionChassisMovement', 'movingAimingDispersion'] },
  virtuoso: { skill: 'driver_virtuoso', params: ['vehicleAllGroundRotationSpeed'] },
  eagleEye: { skill: 'commander_eagleEye', params: ['circularVisionRadius'] },
  finder: { skill: 'radioman_finder', params: ['vehicleCircularVisionRadius'] },
  inventor: { skill: 'radioman_inventor', params: ['radioDistance'] },
  brotherhood: { skill: 'brotherhood', params: [] }
} as const;

export const SKILL_BOOST_LEVEL = 100;
