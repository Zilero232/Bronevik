import { diffSettings, STREAMER_SETTINGS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { compareSections } from '..';

describe('compareSections', () => {
  const rows = diffSettings([
    { zoom: { steps: ['x2', 'x16'] }, camera: { fov: 95, dynamicFov: [80, 100] } },
    { zoom: { steps: ['x2', 'x16'] }, camera: { fov: 100 } }
  ]);

  it('groups known fields in the canonical group order', () => {
    const sections = compareSections(rows);
    const order = sections.map(({ group }) => STREAMER_SETTINGS.groups.indexOf(group));

    expect(sections.map(({ group }) => group)).toEqual(['camera', 'zoom']);
    expect(order).toEqual([...order].sort((left, right) => left - right));
  });

  it('drops fields without a label and keeps the diff flag', () => {
    const camera = compareSections(rows).find(({ group }) => group === 'camera');

    expect(camera?.rows.map(({ field }) => field)).toEqual(['camera.fov']);
    expect(camera?.rows[0]?.differs).toBe(true);
    expect(compareSections(rows).find(({ group }) => group === 'zoom')?.rows[0]?.differs).toBe(false);
  });
});
