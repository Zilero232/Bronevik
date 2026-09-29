import type { AccountBadge } from '../../../../../generated';
import type { RecordEventRow, SnapshotEventRow } from '../../queries';
import type { FeedItem } from '../../social.types';

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

type FeedBadge = Pick<AccountBadge, 'accountId' | 'awardedAt' | 'badgeCode'>;

export type MarkRow = Pick<SnapshotEventRow, 'marks_on_gun' | 'prev_marks'>;

export type MasteryGainInput = {
  row: Pick<SnapshotEventRow, 'mark_of_mastery' | 'prev_mastery'>;
  aceMastery: number;
};
