import type { ComponentProps, ReactNode } from 'react';

export type EntryPanelProps = {
  title: string;
  isOpen: boolean;
  isPending: boolean;
  onSubmit: ComponentProps<'form'>['onSubmit'];
  submitLabel: string;
  hint: string;
  status: string | null;
  isDone: boolean;
  exit: { label: string; onClick: () => void } | null;
  children: ReactNode;
};
