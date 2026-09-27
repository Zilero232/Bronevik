import type { BuildModule } from '../build-catalog';

export type ModuleOptionsInput = {
  modules: readonly BuildModule[];
  labels: { stock: string; top: string };
};

export type ModuleOption = {
  value: string;
  label: string;
};
