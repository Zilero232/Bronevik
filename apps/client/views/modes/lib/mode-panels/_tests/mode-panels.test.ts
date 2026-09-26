import type { ModeSummary, PlayMode } from '@otmetki/schemas';

import { PLAY_MODES } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { latestComputedAt, modePanels } from '../mode-panels';

const summary = (mode: PlayMode, battles: number, computedAt: string | null = null): ModeSummary => ({
  mode,
  battles,
  players: battles,
  tanks: battles,
  computedAt,
  season: null,
  leaders: []
});

describe('modePanels', () => {
  it('returns one panel per mode in the canonical order', () => {
    const panels = modePanels([...PLAY_MODES].reverse().map((mode) => summary(mode, 10)));

    expect(panels.map(({ mode }) => mode)).toEqual([...PLAY_MODES]);
  });

  it('keeps a panel without data for modes the server did not return', () => {
    const [first] = PLAY_MODES;
    const panels = modePanels([summary(first, 10)]);

    expect(panels.find(({ mode }) => mode === first)?.summary).not.toBeNull();
    expect(panels.filter(({ mode }) => mode !== first).every(({ summary: data }) => data === null)).toBe(true);
  });

  it('treats a mode with no battles as empty', () => {
    expect(modePanels(PLAY_MODES.map((mode) => summary(mode, 0))).every(({ summary: data }) => data === null)).toBe(true);
  });
});

describe('latestComputedAt', () => {
  it('picks the newest computation time', () => {
    const older = '2026-09-20T00:00:00.000Z';
    const newer = '2026-09-25T00:00:00.000Z';

    expect(latestComputedAt([summary('ranked', 1, older), summary('frontline', 1, newer), summary('onslaught', 1)])).toBe(newer);
  });

  it('has no time when nothing was computed', () => {
    expect(latestComputedAt([summary('ranked', 1)])).toBeNull();
  });
});
