import { describe, expect, it } from 'vitest';

import { navMarker } from '../nav-marker';

describe('navMarker', () => {
  it('marks the install page only while the modpack can be installed', () => {
    expect(navMarker({ page: 'install', view: null, canInstall: true })).toBe('new');
    expect(navMarker({ page: 'install', view: null, canInstall: false })).toBeNull();
  });

  it('marks home when the patch status offers an action', () => {
    expect(navMarker({ page: 'home', view: { kind: 'update_available', tone: 'premium', action: 'update' }, canInstall: false })).toBe('update');
  });

  it('marks home as a problem on a danger or warning status without an action', () => {
    expect(navMarker({ page: 'home', view: { kind: 'offline', tone: 'danger', action: null }, canInstall: false })).toBe('problem');
    expect(navMarker({ page: 'home', view: { kind: 'up_to_date', tone: 'success', action: null }, canInstall: false })).toBeNull();
  });

  it('leaves the other pages unmarked', () => {
    expect(navMarker({ page: 'sets', view: { kind: 'offline', tone: 'danger', action: null }, canInstall: true })).toBeNull();
  });
});
