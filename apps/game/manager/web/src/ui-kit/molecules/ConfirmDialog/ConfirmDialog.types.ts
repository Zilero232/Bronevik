import type { ReactElement, ReactNode } from 'react';

export type ConfirmDialogProps = {
  title: ReactNode;
  description?: ReactNode;
  confirmLabel: ReactNode;
  cancelLabel: ReactNode;
  tone?: 'danger' | 'default';
  isPending?: boolean;
  trigger: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void;
};
