import { describe, expect, it } from 'vitest';

import type { ReplaySummary } from '../../../../../lib/replay';

import { parseReplaySummary } from '../../../../../lib/replay';
import { FIXTURE, readFixture } from '../../../../../lib/replay/_tests/fixtures';
import { isRecordedBy, modVisibility } from '../mod-upload';

const summary = parseReplaySummary(readFixture(FIXTURE.wgFull));
const recorderId = summary.recorder.accountId ?? 0;
const withRecorder = (accountId: number | null): ReplaySummary => ({ ...summary, recorder: { ...summary.recorder, accountId } });

describe('modVisibility', () => {
  it('keeps a mod upload private when the mod names no visibility', () => {
    expect(modVisibility(undefined)).toBe('private');
  });

  it('accepts public and private regardless of case and padding', () => {
    expect(modVisibility('public')).toBe('public');
    expect(modVisibility(' PRIVATE ')).toBe('private');
  });

  it('refuses unlisted, an empty value and anything else', () => {
    expect(modVisibility('unlisted')).toBeNull();
    expect(modVisibility('')).toBeNull();
    expect(modVisibility('friends')).toBeNull();
  });
});

describe('isRecordedBy', () => {
  it('matches the recorder of the replay to the bound account', () => {
    expect(recorderId).toBeGreaterThan(0);
    expect(isRecordedBy({ summary, accountId: BigInt(recorderId) })).toBe(true);
  });

  it('refuses a replay recorded by another account', () => {
    expect(isRecordedBy({ summary, accountId: BigInt(recorderId) + 1n })).toBe(false);
  });

  it('refuses a replay whose recorder is unknown', () => {
    expect(isRecordedBy({ summary: withRecorder(null), accountId: BigInt(recorderId) })).toBe(false);
  });
});
