import type { RelativeTimeValue } from '@/shared/lib';

export type RelativeTimeProps = {
  value: RelativeTimeValue | null | undefined;
  fallback?: string;
  className?: string;
};
