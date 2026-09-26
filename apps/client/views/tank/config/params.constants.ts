import type { TankSpecKey } from '@/entities/tank/tank';

export const PARAM_KEYS = [
  'maxHealth',
  'shellDamage',
  'shellPenetration',
  'damagePerMinute',
  'reloadTime',
  'aimingTime',
  'dispersion',
  'viewRange',
  'speedForward'
] as const satisfies readonly TankSpecKey[];

export const PARAM_CONFIGS = ['stock', 'top'] as const;
