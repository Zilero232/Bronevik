import type { ComponentProps, ReactNode } from 'react';

import type { GameIcon } from '@/entities/tank/build';
import type { ProgressTone } from '@/ui-kit';

export type UsageRowProps = {
  kind: ComponentProps<typeof GameIcon>['kind'];
  image: string | null;
  label: string;
  share: number;
  valueLabel: ReactNode;
  tone?: ProgressTone;
};
