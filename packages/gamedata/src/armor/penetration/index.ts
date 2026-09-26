export {
  calculateArmorHit,
  isHollowPlate,
  isShieldPlate,
  penetrationAtDistance,
  penetrationVerdict,
  toShellKind,
  traceArmorRay
} from './penetration';
export { PENETRATION, SHELL_KINDS, SHELL_RULES } from './penetration.constants';
export type {
  ArmorHit,
  ArmorLayer,
  ArmorShell,
  ArmorTrace,
  ArmorTraceLayer,
  ArmorVerdict,
  CalculateArmorHitInput,
  PenetrationAtDistanceInput,
  ShellKind,
  TraceArmorRayInput
} from './penetration.types';
