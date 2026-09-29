import { describe, expect, it } from 'vitest';

import { serverFiguresState } from '../server-figures';

const SETTLED = { isPending: false, isError: false, trackedPlayers: null, online: null } as const;

describe('serverFiguresState', () => {
  it('reports an error before anything else', () => {
    expect(serverFiguresState({ ...SETTLED, isPending: true, isError: true })).toBe('error');
  });

  it('stays pending while the pulse is loading', () => {
    expect(serverFiguresState({ ...SETTLED, isPending: true })).toBe('pending');
  });

  it('treats zero tracked players and no online figure as no data yet', () => {
    expect(serverFiguresState({ ...SETTLED, trackedPlayers: 0 })).toBe('empty');
  });

  it('treats a zero online figure as no data yet', () => {
    expect(serverFiguresState({ ...SETTLED, trackedPlayers: 0, online: 0 })).toBe('empty');
  });

  it('is ready once players are tracked', () => {
    expect(serverFiguresState({ ...SETTLED, trackedPlayers: 1 })).toBe('ready');
  });

  it('is ready when only the server online figure is known', () => {
    expect(serverFiguresState({ ...SETTLED, online: 1 })).toBe('ready');
  });
});
