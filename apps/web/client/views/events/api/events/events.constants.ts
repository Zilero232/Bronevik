import { env } from '@/shared/config/client-env';

const icsUrl = `${env.NEXT_PUBLIC_API_URL}/events/calendar.ics`;

export const EVENTS_FEED = {
  ics: icsUrl,
  webcal: icsUrl.replace(/^https?:/, 'webcal:')
} as const;
