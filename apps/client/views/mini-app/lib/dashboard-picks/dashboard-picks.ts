import type { ClosestMarksInput, LestaAccount, MarkChase } from './dashboard-picks.types';

export const primaryAccount = (accounts: LestaAccount[]): LestaAccount | null =>
  accounts.find(({ isPrimary }) => isPrimary) ?? accounts.at(0) ?? null;

export const closestMarks = ({ items, limit }: ClosestMarksInput): MarkChase[] =>
  items
    .flatMap((row) => {
      const { moePercent, nextMarkPercent } = row;

      if (moePercent === null || nextMarkPercent === null || nextMarkPercent <= moePercent) {
        return [];
      }

      return [{ row, percent: moePercent, target: nextMarkPercent, gap: nextMarkPercent - moePercent }];
    })
    .sort((left, right) => left.gap - right.gap)
    .slice(0, Math.max(0, limit));
