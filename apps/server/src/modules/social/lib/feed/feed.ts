import { sortBy } from 'remeda';

import type { BuildFeedInput, FeedItem, MarkRow, MasteryGainInput } from './feed.types';

export const isMarkGain = (row: MarkRow): boolean => row.marks_on_gun !== null && row.prev_marks !== null && row.marks_on_gun > row.prev_marks;

export const isMasteryGain = ({ row, aceMastery }: MasteryGainInput): boolean =>
  row.prev_mastery !== null && row.mark_of_mastery === aceMastery && row.prev_mastery < aceMastery;

export const buildFeed = ({ snapshots, records, badges, nicknames, aceMastery, limit }: BuildFeedInput): FeedItem[] => {
  const items: FeedItem[] = [];
  const base = (accountId: bigint) => ({ accountId: Number(accountId), nickname: nicknames.get(accountId) ?? null, badgeCode: null });

  for (const row of snapshots) {
    if (isMarkGain(row)) {
      items.push({
        ...base(row.account_id),
        kind: 'mark',
        tankId: row.tank_id,
        value: row.marks_on_gun ?? 0,
        previous: row.prev_marks,
        at: row.captured_at.toISOString()
      });
    }

    if (isMasteryGain({ row, aceMastery })) {
      items.push({
        ...base(row.account_id),
        kind: 'mastery',
        tankId: row.tank_id,
        value: row.mark_of_mastery,
        previous: row.prev_mastery,
        at: row.captured_at.toISOString()
      });
    }
  }

  for (const row of records) {
    if (row.max_damage !== null && row.prev_max_damage !== null && row.max_damage > row.prev_max_damage) {
      items.push({
        ...base(row.account_id),
        kind: 'record',
        tankId: row.max_damage_tank_id,
        value: row.max_damage,
        previous: row.prev_max_damage,
        at: row.captured_at.toISOString()
      });
    }
  }

  for (const badge of badges) {
    items.push({
      ...base(badge.accountId),
      kind: 'badge',
      tankId: null,
      value: 1,
      previous: null,
      badgeCode: badge.badgeCode,
      at: badge.awardedAt.toISOString()
    });
  }

  return sortBy(items, [(item) => item.at, 'desc']).slice(0, limit);
};
