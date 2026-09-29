import type { LucideIcon } from 'lucide-react';

type InboxEventTone = 'accent' | 'ally' | 'elite' | 'premium' | 'steel' | 'success' | 'warning';

export type InboxEventLook = {
  icon: LucideIcon;
  tone: InboxEventTone;
};
