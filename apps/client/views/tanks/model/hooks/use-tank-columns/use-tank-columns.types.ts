import type { TANKS_TABLE } from '../../../config';

export type OptionalTankColumn = (typeof TANKS_TABLE.optionalColumns)[number];

export type UseTankColumnsInput = {
  hidden: readonly string[];
};
