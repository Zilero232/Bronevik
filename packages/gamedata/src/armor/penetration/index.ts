export {
  calculateArmorHit,
  isHollowPlate,
  isShieldPlate,
  penetrationAtDistance,
  penetrationChance,
  penetrationVerdict,
  rollChance,
  toShellKind,
  traceArmorRay
} from './penetration';
export { ERF_APPROXIMATION, PENETRATION, SHELL_KINDS, SHELL_RULES } from './penetration.constants';
export type {
  ArmorHit,
  ArmorLayer,
  ArmorShell,
  ArmorTrace,
  ArmorTraceLayer,
  ArmorVerdict,
  CalculateArmorHitInput,
  PenetrationAtDistanceInput,
  PenetrationChanceInput,
  RollChanceInput,
  ShellKind,
  TraceArmorRayInput
} from './penetration.types';
