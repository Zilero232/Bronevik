import type { QueryFunctionContext } from '@tanstack/react-query';

export type CalendarQueryInput = Partial<Pick<QueryFunctionContext, 'signal'>>;
