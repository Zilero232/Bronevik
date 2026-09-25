export const SPEC_DIRECTION: Readonly<{ higherPrefixes: readonly string[]; higher: readonly string[]; lower: readonly string[]; separator: string }> =
  {
    higherPrefixes: ['engines.', 'chassis.', 'armor.', 'speed.'],
    higher: [
      'maxHealth',
      'enginePower',
      'powerToWeight',
      'speedForward',
      'speedBackward',
      'hullTraverse',
      'turretTraverse',
      'viewRange',
      'viewRangeUncapped',
      'radioRange',
      'rateOfFire',
      'damage',
      'damagePerMinute',
      'penetration',
      'penetration100m',
      'penetration500m',
      'elevation',
      'depression',
      'count'
    ],
    lower: [
      'reloadTime',
      'aimingTime',
      'dispersion',
      'dispersionMovement',
      'dispersionHullRotation',
      'dispersionTurretRotation',
      'dispersionAfterShot',
      'interval'
    ],
    separator: '.'
  };
