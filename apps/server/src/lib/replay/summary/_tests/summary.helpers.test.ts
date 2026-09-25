import { describe, expect, it } from 'vitest';

import { blankToNull, detectGame, findPersonalResult, parseClientVersion, parseDateTime, toPlayerResult, unixToIso } from '../summary.helpers';

describe('summary helpers', () => {
  it('detects the game from the client title', () => {
    expect(detectGame('Мир танков v.1.30.0.0 #123')).toBe('lesta');
    expect(detectGame('World of Tanks v.1.26.0.2 #555')).toBe('wg');
    expect(detectGame('Something else')).toBe('unknown');
    expect(detectGame(null)).toBe('unknown');
  });

  it('parses the version from the xml string before the exe string', () => {
    const version = parseClientVersion({ clientVersionFromXml: 'World of Tanks v.1.26.0.2 #555', clientVersionFromExe: '1, 0, 0, 1', vehicles: {} });

    expect(version.numbers).toEqual([1, 26, 0, 2]);
    expect(version.label).toBe('1.26.0.2');
  });

  it('pads a short version with zeros and falls back to the exe string', () => {
    expect(parseClientVersion({ clientVersionFromExe: '1.30', vehicles: {} }).numbers).toEqual([1, 30, 0, 0]);
    expect(parseClientVersion({ clientVersionFromXml: '', vehicles: {} })).toEqual({ xml: null, exe: null, numbers: null, label: null });
  });

  it('turns the replay date into a zoneless ISO string', () => {
    expect(parseDateTime('24.09.2026 18:05:09')).toBe('2026-09-24T18:05:09');
    expect(parseDateTime('2026-09-24')).toBeNull();
  });

  it('converts unix seconds and treats zero as missing', () => {
    expect(unixToIso(1)).toBe(new Date(1000).toISOString());
    expect(unixToIso(0)).toBeNull();
    expect(blankToNull('')).toBeNull();
  });

  it('finds the personal block that is not the avatar entry', () => {
    const personal = findPersonalResult({ avatar: { xp: 1 }, 5_000: { xp: 900, credits: 40_000 } });

    expect(personal?.xp).toBe(900);
    expect(findPersonalResult(null)).toBeNull();
  });

  it('sums every entry and reads survival from the last one', () => {
    const result = toPlayerResult([
      { damageDealt: 100, kills: 1, directHits: 3, health: 50, deathReason: -1 },
      { damageDealt: 250, kills: null, directEnemyHits: 2, health: 0, deathReason: 1, killerID: 12 }
    ]);

    expect(result).toMatchObject({ damageDealt: 350, frags: 1, hits: 5, health: 0, survived: false, killerVehicleId: 12 });
    expect(toPlayerResult([])).toBeNull();
  });

  it('falls back to health when the death reason is missing', () => {
    expect(toPlayerResult([{ health: 10 }])?.survived).toBe(true);
    expect(toPlayerResult([{ health: 0 }])?.survived).toBe(false);
  });
});
