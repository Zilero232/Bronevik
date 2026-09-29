import type { NamedVehicle } from '../../../shop';
import type { SupertestChangeView } from '../../supertest.types';

export type ParsedChange = Pick<SupertestChangeView, 'from' | 'label' | 'param' | 'raw' | 'to' | 'unit'>;

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
