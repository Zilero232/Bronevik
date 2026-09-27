import type { ReactNode } from 'react';

export type SettingsCardProps = {
  icon: ReactNode;
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
};
