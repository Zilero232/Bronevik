export const LOWER_IS_BETTER: readonly string[] = [
  'reloadTime',
  'aimingTime',
  'dispersion',
  'dispersionMovement',
  'dispersionHullRotation',
  'dispersionTurretRotation',
  'dispersionAfterShot',
  'weight',
  'interval'
];

export const SPECS: Readonly<{ maxDepth: number; separator: string; skip: readonly string[] }> = {
  maxDepth: 4,
  separator: '.',
  skip: ['moduleIds', 'modules']
};

export const COMPARE_PROFILE = {
  preferred: 'top'
} as const;
