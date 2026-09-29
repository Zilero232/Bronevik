import { describe, expect, it } from 'vitest';

import { INDEX } from '../../release-index/_tests/fixtures';
import { selectManagerUpdate } from '../manager-update';

const query = { target: 'windows', arch: 'x86_64', current: '0.1.0' };

describe('selectManagerUpdate', () => {
  it('returns the Tauri updater payload for a newer manager on this platform', () => {
    expect(selectManagerUpdate({ index: INDEX, query })).toEqual({
      version: '0.2.0',
      notes: 'Fixes',
      pub_date: '2026-09-27T12:00:00.000Z',
      url: 'https://triotmetki.ru/downloads/manager/0.2.0/otmetki-manager_0.2.0_x64-setup.exe',
      signature: 'c2lnbmF0dXJl'
    });
  });

  it('has no update for the current or a newer manager', () => {
    expect(selectManagerUpdate({ index: INDEX, query: { ...query, current: '0.2.0' } })).toBeNull();
    expect(selectManagerUpdate({ index: INDEX, query: { ...query, current: '0.10.0' } })).toBeNull();
  });

  it('has no update for a platform without a build', () => {
    expect(selectManagerUpdate({ index: INDEX, query: { ...query, target: 'linux' } })).toBeNull();
  });

  it('has no update before the first manager release', () => {
    expect(selectManagerUpdate({ index: { ...INDEX, manager: null }, query })).toBeNull();
  });
});
