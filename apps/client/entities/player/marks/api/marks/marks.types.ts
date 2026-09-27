import type { MarksControllerHistoryData, MarksControllerListData } from '@/shared/api/generated';

export type MoeListInput = NonNullable<MarksControllerListData['query']> & {
  signal?: AbortSignal;
};

export type MoeHistoryInput = MarksControllerHistoryData['path'] &
  NonNullable<MarksControllerHistoryData['query']> & {
    signal?: AbortSignal;
  };
