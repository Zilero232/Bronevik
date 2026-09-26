import type { ReactElement, ReactNode } from 'react';

export type ConfirmDialogTone = 'danger' | 'default';

export type ConfirmDialogProps = {
  title: ReactNode;
  description?: ReactNode;
  confirmLabel: ReactNode;
  cancelLabel: ReactNode;
  tone?: ConfirmDialogTone;
  isPending?: boolean;
  onConfirm: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactElement;
};
