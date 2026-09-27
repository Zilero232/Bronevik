import type { ShellStats } from '@otmetki/schemas';

import type { LiveValueInput, ShellForInput } from './live-value.types';

import { SHELL_QUALIFIERS } from '../../config';

const shellFor = ({ stats, label }: ShellForInput): ShellStats | null => {
  const qualifier = SHELL_QUALIFIERS.find((entry) => entry.pattern.test(label));

  if (!qualifier) {
    return stats.shell;
  }

  return stats.shells.find((shell) => shell.kind === qualifier.kind) ?? null;
};

export const liveValue = ({ param, label, stats }: LiveValueInput): number | null => {
  if (!stats || param === null) {
    return null;
  }

  switch (param) {
    case 'reloadTime':
    case 'aimingTime':
    case 'dispersion':
    case 'dispersionMovement':
    case 'dispersionHullRotation':
    case 'dispersionTurretRotation':
    case 'rateOfFire':
    case 'maxHealth':
    case 'viewRange':
    case 'radioRange':
    case 'speedForward':
    case 'speedBackward':
    case 'hullTraverse':
    case 'turretTraverse':
    case 'enginePower':
    case 'powerToWeight':
    case 'weight': {
      return stats[param];
    }

    case 'clipReloadTime': {
      return stats.clip?.reloadTime ?? null;
    }

    case 'clipInterval': {
      return stats.clip?.interval ?? null;
    }

    case 'depression':
    case 'elevation': {
      const angle = stats[param];

      return angle === null ? null : Math.abs(angle);
    }

    case 'shellDamage': {
      return shellFor({ stats, label })?.damage ?? null;
    }

    case 'shellPenetration': {
      return shellFor({ stats, label })?.penetration100m ?? null;
    }

    case 'shellVelocity': {
      return shellFor({ stats, label })?.speed ?? null;
    }

    case 'damagePerMinute': {
      return shellFor({ stats, label })?.damagePerMinute ?? null;
    }

    default: {
      return null;
    }
  }
};
