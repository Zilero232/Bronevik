import type { ReactNode } from 'react';

export type TabItem<T extends string = string> = {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  count?: ReactNode;
  content?: ReactNode;
};

export type TabsProps<T extends string = string> = {
  items: TabItem<T>[];
  value?: T;
  defaultValue?: T;
  className?: string;
  panelClassName?: string;
  onValueChange?: (value: T) => void;
};
