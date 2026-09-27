import type { QueryFunctionContext } from '@tanstack/react-query';

export type GameStatusRequest = Partial<Pick<QueryFunctionContext, 'signal'>>;
