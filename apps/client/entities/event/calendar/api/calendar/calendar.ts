import { eventsControllerCalendar } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { CalendarRequest } from './calendar.types';

export const getEventCalendar = ({ signal }: CalendarRequest = {}) => fromSdk(() => eventsControllerCalendar({ signal }));
