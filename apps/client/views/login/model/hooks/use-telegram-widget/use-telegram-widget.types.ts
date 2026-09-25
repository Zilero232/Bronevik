import type { RefObject } from 'react';

export type TelegramAuthHandler = (user: Record<string, number | string>) => void;

export type UseTelegramWidgetInput = {
  container: RefObject<HTMLDivElement | null>;
  onSignedIn: () => void;
};
