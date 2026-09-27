import { eventsControllerCalendar } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { CalendarQueryInput } from './calendar.types';

export const getEventCalendar = ({ signal }: CalendarQueryInput = {}) => fromSdk(() => eventsControllerCalendar({ signal }));
