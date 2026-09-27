import type {
  ClansControllerEventsData,
  ClansControllerListData,
  ClansControllerPageData,
  ClansControllerStrongholdData
} from '@/shared/api/generated';

export type ClanPageInput = ClansControllerPageData['path'] & {
  signal?: AbortSignal;
};

export type ClanEventsInput = NonNullable<ClansControllerEventsData['query']> & {
  clanId: ClansControllerEventsData['path']['id'];
  signal?: AbortSignal;
};

export type ClanListInput = NonNullable<ClansControllerListData['query']> & {
  signal?: AbortSignal;
};

export type ClanStrongholdInput = {
  clanId: ClansControllerStrongholdData['path']['id'];
  signal?: AbortSignal;
};
