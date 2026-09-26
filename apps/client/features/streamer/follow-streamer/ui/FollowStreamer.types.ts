import type { ReactNode } from 'react';

import type { FollowState } from '../model/hooks';

export type FollowStreamerProps = {
  slug: string;
  renderExtras?: (state: FollowState) => ReactNode;
  className?: string;
};
