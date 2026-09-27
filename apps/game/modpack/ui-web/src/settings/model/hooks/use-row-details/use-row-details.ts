import { useState } from 'preact/hooks';

export const useRowDetails = () => {
  const [open, setOpen] = useState<string | null>(null);

  return {
    isOpen: (row: string) => open === row,
    toggle: (row: string) => setOpen((current) => (current === row ? null : row))
  };
};
