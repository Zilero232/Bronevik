import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getEventCalendar } from '../calendar';

export const calendarQueries = {
  all: () => queryOptions({ queryKey: QUERY_KEYS.events.calendar, queryFn: ({ signal }) => getEventCalendar({ signal }) })
};
