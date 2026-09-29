import { describe, expect, it } from 'vitest';

import { navMarker } from '../nav-marker';

describe('navMarker', () => {
  it('marks home as new while the modpack can be installed, before any patch status', () => {
    expect(navMarker({ section: 'home', view: { kind: 'not_installed', tone: 'neutral', action: null }, canInstall: true })).toBe('new');
    expect(navMarker({ section: 'home', view: null, canInstall: false })).toBeNull();
  });

  it('marks home when the patch status offers an action', () => {
    expect(navMarker({ section: 'home', view: { kind: 'update_available', tone: 'premium', action: 'update' }, canInstall: false })).toBe('update');
  });

  it('marks home as a problem on a danger or warning status without an action', () => {
    expect(navMarker({ section: 'home', view: { kind: 'offline', tone: 'danger', action: null }, canInstall: false })).toBe('problem');
    expect(navMarker({ section: 'home', view: { kind: 'up_to_date', tone: 'success', action: null }, canInstall: false })).toBeNull();
  });

  it('leaves the other sections unmarked', () => {
    expect(navMarker({ section: 'sets', view: { kind: 'offline', tone: 'danger', action: null }, canInstall: true })).toBeNull();
  });
});
