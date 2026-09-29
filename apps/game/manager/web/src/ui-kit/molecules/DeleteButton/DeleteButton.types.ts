import type { ReactNode } from 'react';

export type DeleteButtonProps = {
  label: string;
  cancelLabel: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
};
