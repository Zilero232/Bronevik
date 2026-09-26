import type { SHELL_KINDS } from './penetration.constants';

export type ShellKind = (typeof SHELL_KINDS)[number];

export type ArmorShell = {
  kind: ShellKind;
  caliber: number;
  penetration: number;
};

export type ArmorVerdict = 'chance' | 'hollow' | 'noPen' | 'pen' | 'ricochet';

export type PenetrationAtDistanceInput = {
  kind: ShellKind;
  at100m: number;
  at500m: number;
  distance: number;
};

export type CalculateArmorHitInput = {
  thickness: number;
  angle: number;
  shell: ArmorShell;
  flags?: number;
  randomness?: number;
};

export type ArmorHit = {
  angle: number;
  normalizedAngle: number;
  effective: number;
  overmatch: boolean;
  canRicochet: boolean;
  ricochet: boolean;
  verdict: ArmorVerdict;
};

export type PenetrationVerdictInput = {
  penetration: number;
  effective: number;
  randomness: number;
};

export type HollowPlateInput = {
  thickness: number;
  flags: number;
};

export type ArmorLayer = {
  thickness: number;
  angle: number;
  flags: number;
  gap: number;
};

export type TraceArmorRayInput = {
  layers: readonly ArmorLayer[];
  shell: ArmorShell;
  randomness?: number;
};

export type ArmorTraceLayer = ArmorHit & {
  thickness: number;
  flags: number;
  penetration: number;
};

export type ArmorTrace = {
  layers: ArmorTraceLayer[];
  mainIndex: number;
  total: number;
  remaining: number;
  verdict: ArmorVerdict;
};

export type TraceRunInput = {
  layers: readonly ArmorLayer[];
  shell: ArmorShell;
};

export type TraceRun = Omit<ArmorTrace, 'verdict'> & {
  outcome: 'hollow' | 'noPen' | 'pen' | 'ricochet';
};
