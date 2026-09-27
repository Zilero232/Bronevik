import type { GainedMark, GainedMarksInput, SnapshotMarksInput, TankKey, TankMarks } from './marks-gain.types';

const keyOf = ({ accountId, tankId }: TankKey): string => `${accountId}:${tankId}`;

export const snapshotMarks = (snapshots: SnapshotMarksInput): TankMarks[] => {
  const best = new Map<string, TankMarks>();

  for (const snapshot of snapshots) {
    if (snapshot.marksOnGun === null || snapshot.marksOnGun === undefined) {
      continue;
    }

    const entry = { accountId: BigInt(snapshot.accountId), tankId: snapshot.tankId, marks: snapshot.marksOnGun };
    const current = best.get(keyOf(entry));

    if (!current || entry.marks > current.marks) {
      best.set(keyOf(entry), entry);
    }
  }

  return [...best.values()];
};

export const gainedMarks = ({ current, previous }: GainedMarksInput): GainedMark[] => {
  const before = new Map(previous.map((row) => [keyOf(row), row.marksOnGun]));

  return current.flatMap((entry) => {
    const was = before.get(keyOf(entry));

    return was !== null && was !== undefined && entry.marks > was ? [{ ...entry, previous: was }] : [];
  });
};
