import type { LucideIcon } from 'lucide-react';

export type InboxEventTone = 'accent' | 'ally' | 'elite' | 'premium' | 'steel' | 'success' | 'warning';

export type InboxEventLook = {
  icon: LucideIcon;
  tone: InboxEventTone;
};
