import { describe, expect, it } from 'vitest';

import { gainedMarks, snapshotMarks } from '../marks-gain';

describe('snapshotMarks', () => {
  it('keeps the highest marks seen per account and tank', () => {
    expect(
      snapshotMarks([
        { accountId: 1n, tankId: 10, marksOnGun: 1 },
        { accountId: 1n, tankId: 10, marksOnGun: 2 },
        { accountId: 1n, tankId: 10, marksOnGun: 0 },
        { accountId: 2n, tankId: 10, marksOnGun: 3 }
      ])
    ).toEqual([
      { accountId: 1n, tankId: 10, marks: 2 },
      { accountId: 2n, tankId: 10, marks: 3 }
    ]);
  });

  it('keeps a zero mark but skips an unknown one', () => {
    expect(
      snapshotMarks([
        { accountId: 1n, tankId: 10, marksOnGun: 0 },
        { accountId: 1n, tankId: 11, marksOnGun: null },
        { accountId: 1n, tankId: 12 }
      ])
    ).toEqual([{ accountId: 1n, tankId: 10, marks: 0 }]);
  });

  it('reads a numeric account id as a bigint', () => {
    expect(snapshotMarks([{ accountId: 5, tankId: 10, marksOnGun: 1 }])[0]?.accountId).toBe(5n);
  });
});

describe('gainedMarks', () => {
  const current = [{ accountId: 1n, tankId: 10, marks: 2 }];

  it('announces a rise over the stored marks', () => {
    expect(gainedMarks({ current, previous: [{ accountId: 1n, tankId: 10, marksOnGun: 1 }] })).toEqual([{ ...current[0], previous: 1 }]);
  });

  it('announces the first mark after a stored zero', () => {
    expect(gainedMarks({ current, previous: [{ accountId: 1n, tankId: 10, marksOnGun: 0 }] })).toHaveLength(1);
  });

  it('stays quiet when the previous value is unknown or null', () => {
    expect(gainedMarks({ current, previous: [] })).toEqual([]);
    expect(gainedMarks({ current, previous: [{ accountId: 1n, tankId: 10, marksOnGun: null }] })).toEqual([]);
  });

  it('stays quiet when the marks did not rise', () => {
    expect(gainedMarks({ current, previous: [{ accountId: 1n, tankId: 10, marksOnGun: 2 }] })).toEqual([]);
    expect(gainedMarks({ current, previous: [{ accountId: 1n, tankId: 10, marksOnGun: 3 }] })).toEqual([]);
  });

  it('matches the previous value by both account and tank', () => {
    expect(
      gainedMarks({
        current,
        previous: [
          { accountId: 2n, tankId: 10, marksOnGun: 0 },
          { accountId: 1n, tankId: 11, marksOnGun: 0 }
        ]
      })
    ).toEqual([]);
  });
});
