import { describe, expect, it } from 'vitest';

import { isSettledStatus, validateReplayFile } from '../upload-validation';

const RULES = { maxBytes: 1000, extensions: ['.mtreplay', '.wotreplay'] };

describe('validateReplayFile', () => {
  it('accepts both replay extensions regardless of case', () => {
    expect(validateReplayFile({ file: { name: 'battle.mtreplay', size: 10 }, rules: RULES })).toBeNull();
    expect(validateReplayFile({ file: { name: 'BATTLE.WOTREPLAY', size: 10 }, rules: RULES })).toBeNull();
  });

  it('rejects any other extension before looking at the size', () => {
    expect(validateReplayFile({ file: { name: 'battle.mtreplay.zip', size: 5000 }, rules: RULES })).toBe('extension');
  });

  it('accepts a file exactly at the size limit and rejects one byte more', () => {
    expect(validateReplayFile({ file: { name: 'a.mtreplay', size: 1000 }, rules: RULES })).toBeNull();
    expect(validateReplayFile({ file: { name: 'a.mtreplay', size: 1001 }, rules: RULES })).toBe('size');
  });

  it('rejects an empty file', () => {
    expect(validateReplayFile({ file: { name: 'a.mtreplay', size: 0 }, rules: RULES })).toBe('empty');
  });
});

describe('isSettledStatus', () => {
  it('stops polling only once parsing has finished either way', () => {
    expect(isSettledStatus('parsed')).toBe(true);
    expect(isSettledStatus('failed')).toBe(true);
    expect(isSettledStatus('uploaded')).toBe(false);
    expect(isSettledStatus('parsing')).toBe(false);
    expect(isSettledStatus(undefined)).toBe(false);
  });
});
