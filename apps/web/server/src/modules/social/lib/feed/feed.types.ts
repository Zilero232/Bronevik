import type { FeedItem, RecordEventRow, SnapshotEventRow } from '../../social.types';

export type BuildFeedInput = {
  snapshots: readonly SnapshotEventRow[];
  records: readonly RecordEventRow[];
  badges: readonly FeedBadge[];
  nicknames: ReadonlyMap<bigint, string>;
  aceMastery: number;
  limit: number;
  badgeOf: (code: string) => FeedItem['badge'];
};

export type { FeedItem };

export type FeedBadge = {
  accountId: bigint;
  badgeCode: string;
  awardedAt: Date;
};

export type MarkRow = Pick<SnapshotEventRow, 'marks_on_gun' | 'prev_marks'>;

export type MasteryGainInput = {
  row: Pick<SnapshotEventRow, 'mark_of_mastery' | 'prev_mastery'>;
  aceMastery: number;
};
