'use client';

import { useBoolean } from '@siberiacancode/reactuse';

export const useConfirmAction = (onConfirm: () => void) => {
  const [isOpen, setOpen] = useBoolean(false);

  const onOpenChange = (next: boolean) => setOpen(next);

  const onConfirmClick = () => {
    onConfirm();
    setOpen(false);
  };

  return { isOpen, onOpenChange, onConfirmClick };
};
