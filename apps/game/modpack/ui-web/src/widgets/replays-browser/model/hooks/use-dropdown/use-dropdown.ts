import { useState } from 'preact/hooks';

import type { UseDropdownInput } from './use-dropdown.types';

import { useEscapeLayer } from '../../../../../shared/lib/use-escape-layer';
import { useWheelScroll } from '../../../../../shared/lib/use-wheel-scroll';

export const useDropdown = <Value>({ onSelect }: UseDropdownInput<Value>) => {
  const [open, setOpen] = useState(false);
  const menuRef = useWheelScroll();
  const close = (): void => setOpen(false);

  useEscapeLayer({ kind: 'popover', active: open, onEscape: close });

  return {
    open,
    menuRef,
    toggle: () => setOpen(!open),
    close,
    choose: (value: Value) => {
      close();
      onSelect(value);
    }
  };
};
