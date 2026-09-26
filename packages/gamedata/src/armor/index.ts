export { ARMOR_GEOMETRY_FORMAT, base64ToBytes, bytesToBase64, decodeArmorGeometry, encodeArmorGeometry } from './geometry';
export { ARMOR_FLAGS, ARMOR_PIECE_KINDS, armorFlags, armorPieceKind, hasArmorFlag } from './model';
export type {
  ArmorChassisModule,
  ArmorFlag,
  ArmorGeometry,
  ArmorGroup,
  ArmorGunModule,
  ArmorModules,
  ArmorMounts,
  ArmorPieceArmor,
  ArmorPieceGeometry,
  ArmorPieceKind,
  ArmorPlate,
  ArmorShellOption,
  ArmorTurretModule,
  Vec3
} from './model';
export {
  calculateArmorHit,
  isHollowPlate,
  isShieldPlate,
  PENETRATION,
  penetrationAtDistance,
  penetrationVerdict,
  SHELL_KINDS,
  SHELL_RULES,
  toShellKind,
  traceArmorRay
} from './penetration';
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
} from './penetration';
