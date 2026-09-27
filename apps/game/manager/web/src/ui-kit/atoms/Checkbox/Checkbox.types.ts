import type { ReactNode } from 'react';

export type CheckboxProps = {
  checked: boolean;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
};
