import type { QueryFunctionContext } from '@tanstack/react-query';

export type GameStatusQueryInput = Partial<Pick<QueryFunctionContext, 'signal'>>;
