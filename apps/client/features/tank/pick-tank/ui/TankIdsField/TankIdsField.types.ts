import type { ReactNode } from 'react';

export type TankIdsFieldProps = {
  value: readonly number[];
  max: number;
  label?: ReactNode;
  placeholder?: string;
  onChange: (tankIds: number[]) => void;
};
