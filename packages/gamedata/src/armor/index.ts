export { ARMOR_FLAGS, ARMOR_PIECE_KINDS, armorFlags, armorPieceKind, hasArmorFlag, listArmorGuns } from './armor-model';
export type {
  ArmorChassisModule,
  ArmorFlag,
  ArmorGeometry,
  ArmorGroup,
  ArmorGunModule,
  ArmorGunOption,
  ArmorModules,
  ArmorMounts,
  ArmorPieceArmor,
  ArmorPieceGeometry,
  ArmorPieceKind,
  ArmorPlate,
  ArmorShellOption,
  ArmorTurretModule,
  ListArmorGunsInput,
  Vec3
} from './armor-model';
export { ARMOR_GEOMETRY_FORMAT, base64ToBytes, bytesToBase64, decodeArmorGeometry, encodeArmorGeometry } from './geometry';
export {
  calculateArmorHit,
  ERF_APPROXIMATION,
  isHollowPlate,
  isShieldPlate,
  PENETRATION,
  penetrationAtDistance,
  penetrationChance,
  penetrationVerdict,
  rollChance,
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
  PenetrationChanceInput,
  RollChanceInput,
  ShellKind,
  TraceArmorRayInput
} from './penetration';
