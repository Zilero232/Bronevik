import type { QueryFunctionContext } from '@tanstack/react-query';

export type ModpackReleaseQueryInput = Partial<Pick<QueryFunctionContext, 'signal'>>;

export type ModpackChangelogQueryInput = ModpackReleaseQueryInput & {
  limit: number;
};
