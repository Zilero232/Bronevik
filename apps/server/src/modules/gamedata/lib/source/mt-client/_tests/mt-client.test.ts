import { describe, expect, it } from 'vitest';

import { assertMtClient, compareEncyclopediaVersion } from '../mt-client';
import { MT_CLIENT } from '../mt-client.constants';
import { ForeignClientError } from '../mt-client.errors';

const MT_README = '# MT.RU.PRODUCTION\n\nDecompiled World of Tanks sources for `MT.RU.PRODUCTION`, currently 1.45.0.5231.\n';
const WG_README = '# WOT.EU.PRODUCTION\n\nDecompiled World of Tanks sources for `WOT.EU.PRODUCTION`, currently 2.4.0.5450.\n';
const guid = MT_CLIENT.guids.release;
const label = 'unicum-gg/wot.src@RU';

describe('assertMtClient', () => {
  it('accepts a Мир танков 1.x build that names its guid', () => {
    expect(assertMtClient({ label, version: '1.45.0.5231', guid, readme: MT_README })).toBe('1.45.0.5231');
  });

  it('accepts a mirror without a README on the version alone', () => {
    expect(assertMtClient({ label: 'izeberg/wot-src@RU', version: '1.45.0.8259', guid })).toBe('1.45.0.8259');
  });

  it('refuses a World of Tanks 2.x build', () => {
    expect(() => assertMtClient({ label, version: '2.4.0.5450', guid })).toThrow(ForeignClientError);
  });

  it('refuses a Wargaming guid even on a 1.x version', () => {
    expect(() => assertMtClient({ label, version: '1.45.0.5231', guid, readme: WG_README })).toThrow(/WOT\.EU\.PRODUCTION/);
  });

  it('refuses the public test guid for the release source', () => {
    const readme = MT_README.replaceAll('MT.RU.PRODUCTION', MT_CLIENT.guids.test);

    expect(() => assertMtClient({ label, version: '1.45.0.5231', guid, readme })).toThrow(ForeignClientError);
  });

  it('refuses a mirror with no version file', () => {
    expect(() => assertMtClient({ label, version: undefined, guid })).toThrow(/version_name/);
  });
});

describe('compareEncyclopediaVersion', () => {
  it('matches the client build to the encyclopedia by release line', () => {
    expect(compareEncyclopediaVersion({ clientVersion: '1.45.0.5231', encyclopediaVersion: '1.45.0.0' })).toEqual({
      matches: true,
      client: '1.45',
      encyclopedia: '1.45'
    });
  });

  it('flags a client that is a release behind the live game', () => {
    expect(compareEncyclopediaVersion({ clientVersion: '1.44.1.4210', encyclopediaVersion: '1.45' }).matches).toBe(false);
  });
});
