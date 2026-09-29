import { Trash2 } from 'lucide-react';

import type { DeleteButtonProps } from './DeleteButton.types';

import { IconButton } from '../../atoms';
import { ConfirmDialog } from '../ConfirmDialog';

export const DeleteButton = ({ label, cancelLabel, title, description, disabled, isPending, onConfirm }: DeleteButtonProps) => (
  <ConfirmDialog
    trigger={
      <IconButton disabled={disabled} label={label}>
        <Trash2 aria-hidden />
      </IconButton>
    }
    cancelLabel={cancelLabel}
    confirmLabel={label}
    description={description}
    isPending={isPending}
    title={title}
    tone='danger'
    onConfirm={onConfirm}
  />
);
