import type { LucideIcon } from 'lucide-react';

import type { ToolKey } from '../../../config';

export type ToolCardProps = {
  tool: ToolKey;
  icon: LucideIcon;
  isFlipped: boolean;
};
