import type { ServiceStatusValue } from '@/ui-kit';

export type GameStatus = {
  version: string | null;
  status: ServiceStatusValue;
};
