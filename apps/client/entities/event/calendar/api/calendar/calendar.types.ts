import type { QueryFunctionContext } from '@tanstack/react-query';

export type CalendarRequest = Partial<Pick<QueryFunctionContext, 'signal'>>;
