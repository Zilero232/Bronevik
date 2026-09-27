import { ArrowRightLeft, Download, RefreshCw } from 'lucide-react';

export const PATCH_ACTION_BUTTONS = {
  check: { variant: 'secondary', label: 'check', icon: RefreshCw },
  migrate: { variant: 'primary', label: 'migrate', icon: ArrowRightLeft },
  update: { variant: 'premium', label: 'update', icon: Download }
} as const;
