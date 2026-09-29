import type { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';

export type DialogContentProps = ComponentProps<typeof BaseDialog.Popup> & {
  size?: 'lg' | 'md';
};
