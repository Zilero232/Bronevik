import { describe, expect, it } from 'vitest';

import { pageSample, rawPageSample } from '../../../_tests/fixtures';
import { parseReplaysPage } from '../parse-replays-page';

describe(parseReplaysPage, () => {
  it('reads the page the Python model builds', () => {
    const page = parseReplaysPage(rawPageSample());

    expect(page?.items.map((item) => [item.map, item.tier, item.result, item.site?.state])).toEqual([
      ['05_prohorovka', 5, 'win', 'uploaded'],
      ['02_malinovka', 7, null, 'queued']
    ]);
  });

  it('turns an unknown battle type or upload state into the fallback instead of dropping the page', () => {
    const sample = pageSample();
    const page = parseReplaysPage({ ...sample, upload: 'later', items: sample.items.map((item) => ({ ...item, type: 'mystery' })) });

    expect(page?.upload).toBe('missing');
    expect(page?.items.every((item) => item.type === 'other')).toBe(true);
  });

  it('rejects another page kind', () => {
    expect(parseReplaysPage({ kind: 'list', empty: '', rows: [] })).toBeNull();
    expect(parseReplaysPage(null)).toBeNull();
  });
});
