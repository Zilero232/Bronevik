// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { marksReportSchema } from '../../../../../../../../shared/api/protocol';
import { imageSources, mount } from '../../../../../../../../shared/lib/testing/mount';
import { MarksReport } from '../MarksReport';

const report = marksReportSchema.parse(
  JSON.parse(
    readFileSync(path.resolve(import.meta.dirname, '../../../../../../../../shared/api/protocol/_tests/fixtures/marks-report.sample.json'), 'utf8')
  )
);

describe(MarksReport, () => {
  it('draws the tank header, the progress, the cards, the chart and the battles table', () => {
    const html = mount({ Component: MarksReport, props: { report } });

    expect(imageSources(html)).toEqual([
      'img://gui/maps/icons/flags/25x17/germany.png',
      'img://gui/maps/icons/levels/tank_level_small_7.png',
      'img://gui/maps/icons/vehicleTypes/white/heavyTank.png',
      'img://gui/maps/icons/library/marksOnGun/mark_2.png'
    ]);

    expect(html.textContent).toContain('Tiger I');
    expect(html.textContent).toContain('85,20 %');
    expect(html.querySelectorAll('polyline')).toHaveLength(1);
    expect(html.textContent).toContain('4 500');
  });
});
