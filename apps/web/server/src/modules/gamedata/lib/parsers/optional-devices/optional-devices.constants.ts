export const DEVICE_SCRIPT = {
  static: 'StaticOptionalDevice',
  stereoscope: 'Stereoscope',
  camouflageNet: 'CamouflageNet',
  lowNoiseTracks: 'LowNoiseTracks',
  grousers: 'Grousers',
  rotationMechanisms: 'RotationMechanisms'
} as const;

export const DEVICE_SCRIPT_SUFFIXES = ['Upgradable', 'Upgraded'] as const;

export const DEVICE_KIND_TAG = {
  deluxe: 'deluxe',
  trophyBasic: 'trophyBasic',
  trophyUpgraded: 'trophyUpgraded',
  modernizedPrefix: 'modernized_'
} as const;

export const DEVICE_SPECIAL_MODIFIERS = {
  stereoscope: { param: 'circularVisionRadius', attribute: 'circularVisionRadius' },
  camouflageNet: { param: 'invisibilityBonus', attribute: 'invisibility/additive' },
  lowNoiseTracks: { param: 'invisibilityBonus', attribute: 'miscAttrs/invisibilityAdditiveTerm' },
  grousers: { param: 'rotationFactor', attribute: 'physics/terrainResistance' },
  grousersFriction: { param: 'rollingFrictionFactor', attribute: 'physics/rollingFrictionFactor' },
  trackMove: { param: 'trackMoveSpeedFactor', attribute: 'miscAttrs/onMoveRotationSpeedFactor' },
  trackRotate: { param: 'trackRotateSpeedFactor', attribute: 'miscAttrs/onStillRotationSpeedFactor' },
  wheelMove: { param: 'wheelMoveSpeedFactor', attribute: 'miscAttrs/onMoveRotationSpeedFactor' },
  wheelRotate: { param: 'wheelRotateSpeedFactor', attribute: 'miscAttrs/onStillRotationSpeedFactor' },
  wheelCenter: { param: 'wheelCenterRotationFwdSpeed', attribute: 'miscAttrs/centerRotationFwdSpeedFactor' }
} as const;
