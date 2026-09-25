import type { WebhookEvent } from '@bronevik/schemas';

export type KeyFixtureInput = {
  name: string;
  daysAgo: number;
  usedMinutesAgo: number | null;
};

export type UsagePointInput = {
  day: Date;
  scale: number;
};

export type DeliveryFixtureInput = {
  event: WebhookEvent;
  position: number;
  isFailing: boolean;
};
