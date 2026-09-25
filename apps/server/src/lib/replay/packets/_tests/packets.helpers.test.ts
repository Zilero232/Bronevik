import { describe, expect, it } from 'vitest';

import { PACKET_SUPPORT, WG_VEHICLE_METHOD_IDS } from '../packets.constants';
import { compareVersions, htmlToText, resolveSupport, wgVehicleMethodIds } from '../packets.helpers';

describe('packet helpers', () => {
  it('compares versions segment by segment, treating missing segments as zero', () => {
    expect(compareVersions({ left: [1, 2], right: [1, 2, 0, 0] })).toBe(0);
    expect(compareVersions({ left: [1, 10], right: [1, 9, 9] })).toBeGreaterThan(0);
    expect(compareVersions({ left: [0, 9], right: [1] })).toBeLessThan(0);
  });

  it('strips tags and decodes entities', () => {
    expect(htmlToText('<font color="#fff">a&nbsp;&lt;b&gt; &amp; &quot;c&quot; &#39;d&#39;</font>')).toBe('a <b> & "c" \'d\'');
  });

  it('picks the newest method table at or before the version', () => {
    const [first, second] = WG_VEHICLE_METHOD_IDS;
    const last = WG_VEHICLE_METHOD_IDS.at(-1);

    expect(wgVehicleMethodIds([...first.since])).toEqual(first.ids);
    expect(wgVehicleMethodIds([...second.since])).toEqual(second.ids);
    expect(wgVehicleMethodIds([9, 0, 0, 0])).toEqual(last?.ids);
    expect(wgVehicleMethodIds([0, 1, 0, 0])).toBeNull();
  });

  it('marks old clients unsupported and custom method ids as custom', () => {
    expect(resolveSupport({ game: 'wg', methodIds: undefined, version: [0, 8, 0, 0] }).status).toBe('unsupported');
    expect(resolveSupport({ game: 'wg', methodIds: undefined, version: null }).status).toBe('unsupported');

    const ids = { onHealthChanged: 1, showDamageFromShot: 2, showShooting: 3 };
    const custom = resolveSupport({ game: 'lesta', methodIds: ids, version: [...PACKET_SUPPORT.wgVerifiedUntil] });

    expect(custom).toMatchObject({ status: 'best-effort', methodIdSource: 'custom', methodIds: ids });
  });
});
