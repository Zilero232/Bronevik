import { describe, expect, it } from 'vitest';

import { isPatchNotes, patchVersion, versionCandidates } from '../patch-notes';

describe('patchVersion', () => {
  it('reads the version from a release headline', () => {
    expect(patchVersion('Обновление 1.45: список изменений')).toBe('1.45');
    expect(patchVersion('Запустили пятый общий тест обновления 1.45 в «Мире танков»')).toBe('1.45');
  });

  it('returns null when no version is named', () => {
    expect(patchVersion('Празднуем День танкиста!')).toBeNull();
  });
});

describe('isPatchNotes', () => {
  it('needs both an update keyword and a version', () => {
    expect(isPatchNotes('Обновление 2.1')).toBe(true);
    expect(isPatchNotes('Обновление ангара')).toBe(false);
  });
});

describe('versionCandidates', () => {
  it('also tries the four-part form stored for client builds', () => {
    expect(versionCandidates('1.45')).toEqual(['1.45', '1.45.0.0']);
    expect(versionCandidates('1.45.0.0')).toEqual(['1.45.0.0']);
  });
});
