import { describe, expect, it } from 'vitest';

import type { ReplayRow } from '../replay-view.types';

import { parseReplaySummary } from '../../../../../lib/replay';
import { FIXTURE, readFixture } from '../../../../../lib/replay/_tests/fixtures';
import { REPLAY_LINKS } from '../../../config';
import { toReplayView } from '../replay-view';

const summary = parseReplaySummary(readFixture(FIXTURE.wgFull));
const apiUrl = 'https://api.example.test';

const row = (fields: Partial<ReplayRow> = {}): ReplayRow => ({
  id: '00000000-0000-4000-8000-000000000001',
  status: 'parsed',
  visibility: 'public',
  gameVersion: null,
  arenaId: null,
  mapName: null,
  battleType: null,
  gameplayMode: null,
  playedAt: null,
  result: null,
  damageDealt: null,
  damageAssisted: null,
  frags: null,
  xp: null,
  medals: [],
  views: 0,
  summary,
  createdAt: new Date('2026-09-20T18:00:00Z'),
  ...fields
});

describe('toReplayView', () => {
  it('takes the owner from the recorder of the stored summary', () => {
    const recorder = summary.players.find((player) => player.isRecorder);

    expect(toReplayView({ replay: row(), apiUrl }).owner?.accountId).toBe(recorder?.accountId);
  });

  it('drops participants without a known account or tank', () => {
    const view = toReplayView({ replay: row(), apiUrl });
    const known = summary.players.filter((player) => (player.accountId ?? 0) > 0 && (player.tankId ?? 0) > 0);

    expect(view.players).toHaveLength(known.length);
  });

  it('shows no players and no duration when the stored summary is unreadable', () => {
    const view = toReplayView({ replay: row({ summary: { broken: true } }), apiUrl });

    expect(view.players).toEqual([]);
    expect(view.owner).toBeNull();
    expect(view.durationSec).toBeNull();
  });

  it('prefers the gameplay mode over the raw battle type', () => {
    expect(toReplayView({ replay: row({ battleType: 'random', gameplayMode: 'ctf' }), apiUrl }).battleType).toBe('ctf');
  });

  it('builds the download link against the API origin', () => {
    const view = toReplayView({ replay: row(), apiUrl });

    expect(view.downloadUrl).toBe(new URL(REPLAY_LINKS.file.replace('{id}', row().id), apiUrl).href);
  });
});
