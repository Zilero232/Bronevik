import type { ReportTargetType } from '../api';

export type ReportButtonProps = {
  targetType: ReportTargetType;
  targetId: string;
  className?: string;
};
