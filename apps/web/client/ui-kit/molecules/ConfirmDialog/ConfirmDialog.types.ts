import type { ReactElement, ReactNode } from 'react';

type ConfirmDialogTone = 'danger' | 'default';

export type ConfirmDialogProps = {
  title: ReactNode;
  description?: ReactNode;
  confirmLabel: ReactNode;
  cancelLabel: ReactNode;
  tone?: ConfirmDialogTone;
  isPending?: boolean;
  isConfirmDisabled?: boolean;
  children?: ReactNode;
  onConfirm: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactElement;
};
