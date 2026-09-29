import type { ComponentProps, ReactNode } from 'react';

export type DailyLayoutProps = ComponentProps<'div'> & {
  side: ReactNode;
  isWide?: boolean;
};
