import { describe, expect, it } from 'vitest';

import { bool, entries, get, localizationFallback, mergeNodes, node, num, nums, parseXml, price, scalars, scriptName, text, words } from '../xml';

const SAMPLE = `<?xml version="1.0" encoding="utf-8"?>
<root>
\t<xmlns:xmlref>http://bwt/xmlref</xmlns:xmlref>
\t<R54_KV-5>
\t\t<userString>#ussr_vehicles:KV-5</userString>
\t\t<price>
\t\t\t11000
\t\t\t<gold/>
\t\t</price>
\t\t<tags>heavyTank role_HT_assault HD</tags>
\t\t<notInShop>true</notInShop>
\t\t<moving>
\t\t\t0.07
\t\t\t<!--BW_String-->
\t\t</moving>
\t\t<terrainResistance>1.1 1.7 2.6</terrainResistance>
\t\t<script>
\t\t\tFuel
\t\t\t<enginePowerFactor>1.05</enginePowerFactor>
\t\t</script>
\t</R54_KV-5>
</root>`;

describe('parseXml', () => {
  const root = parseXml(SAMPLE);
  const vehicle = node(root['R54_KV-5']);

  it('returns the <root> children and skips namespace keys when iterating', () => {
    expect(entries(root).map(([key]) => key)).toEqual(['R54_KV-5']);
  });

  it('reads numbers that carry a BW_String comment', () => {
    expect(num(vehicle?.moving)).toBe(0.07);
  });

  it('reads space-separated vectors, tags and booleans', () => {
    expect(nums(vehicle?.terrainResistance)).toEqual([1.1, 1.7, 2.6]);
    expect(words(vehicle?.tags)).toEqual(['heavyTank', 'role_HT_assault', 'HD']);
    expect(bool(vehicle?.notInShop)).toBe(true);
  });

  it('detects the currency marker inside a price', () => {
    expect(price(vehicle?.price)).toEqual({ amount: 11000, currency: 'gold' });
    expect(price('500')).toEqual({ amount: 500, currency: 'credits' });
  });

  it('separates a script class name from its parameters', () => {
    expect(scriptName(vehicle?.script)).toBe('Fuel');
    expect(scalars(vehicle?.script)).toEqual({ enginePowerFactor: 1.05 });
    expect(num(get(vehicle, 'script/enginePowerFactor'))).toBe(1.05);
  });

  it('turns localization keys into readable fallbacks', () => {
    expect(text(vehicle?.userString)).toBe('#ussr_vehicles:KV-5');
    expect(localizationFallback(vehicle?.userString)).toBe('KV-5');
    expect(localizationFallback('#ussr_vehicles:_122-mm_D-25T')).toBe('122-mm D-25T');
  });

  it('merges a local override over a shared definition', () => {
    const merged = mergeNodes({ id: '14', reloadTime: '14.74', '#text': 'shared' }, { reloadTime: '12.3', '#text': 'shared' });

    expect(merged).toEqual({ id: '14', reloadTime: '12.3' });
  });
});
