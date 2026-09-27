import type { NamedVehicle } from '../../../shop';

export type ParsedChange = {
  param: string | null;
  label: string;
  from: number | null;
  to: number | null;
  unit: string | null;
  raw: string;
};

export type TankHeading = {
  tankId: number | null;
  name: string;
};

export type ParsedTank = TankHeading & {
  isNewVehicle: boolean;
  changes: ParsedChange[];
};

export type ParseArticleInput = {
  lines: readonly string[];
  vehicles: readonly NamedVehicle[];
};

export type VehicleInInput = {
  line: string;
  vehicles: readonly NamedVehicle[];
};

export type HeadingInput = {
  rows: readonly string[];
  index: number;
  vehicles: readonly NamedVehicle[];
};

export type NormaliseInput = {
  param: string | null;
  value: number;
};
