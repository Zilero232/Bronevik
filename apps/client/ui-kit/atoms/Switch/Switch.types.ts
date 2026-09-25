import type { ReactNode } from 'react';

export type SwitchProps = {
  checked: boolean;
  label: ReactNode;
  description?: ReactNode;
  className?: string;
  onCheckedChange: (checked: boolean) => void;
};
