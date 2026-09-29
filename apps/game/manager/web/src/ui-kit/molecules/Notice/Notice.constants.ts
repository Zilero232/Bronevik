import { CircleCheck, Info, OctagonAlert, TriangleAlert } from 'lucide-react';

export const NOTICE_ICONS = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: OctagonAlert
} as const;
