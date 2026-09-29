import type { ReactNode } from 'react';

export type CommunityGateProps = {
  children: ReactNode;
  requiresLesta?: boolean;
  signInHint?: ReactNode;
  className?: string;
};
