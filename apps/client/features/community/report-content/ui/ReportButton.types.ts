import type { ReportTargetType } from '@/shared/api/moderation';

export type ReportButtonProps = {
  targetType: ReportTargetType;
  targetId: string;
  className?: string;
};
