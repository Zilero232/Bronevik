import { parseAsStringLiteral } from 'nuqs/server';

export const STUDIO_TABS = ['profile', 'settings', 'integrations', 'overlays', 'challenges'] as const;

export type StudioTab = (typeof STUDIO_TABS)[number];

export const STUDIO_TAB_PARSER = parseAsStringLiteral(STUDIO_TABS).withDefault('profile');

export const STUDIO_QUERY = {
  tab: 'tab',
  connected: 'connected',
  streamer: 'streamer'
} as const;

export const STUDIO_CALLBACK = {
  connected: 'connected',
  failed: 'failed',
  toastId: 'streamer-integration-callback'
} as const;
