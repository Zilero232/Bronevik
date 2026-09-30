// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { marksReportSchema } from '../../../../../../../../shared/api/protocol';
import { imageSources, mount } from '../../../../../../../../shared/lib/testing/mount';
import { MarksReport } from '../MarksReport';

const REPORT = marksReportSchema.parse(
  JSON.parse(
    readFileSync(path.resolve(import.meta.dirname, '../../../../../../../../shared/api/protocol/_tests/fixtures/marks-report.sample.json'), 'utf8')
  )
);

const render = () => mount({ Component: MarksReport, props: { report: REPORT } });

describe(MarksReport, () => {
  it('draws the tank header icons: nation, tier, class and the current mark', () => {
    expect(imageSources(render())).toEqual([
      'img://gui/maps/icons/flags/25x17/germany.png',
      'img://gui/maps/icons/levels/tank_level_small_7.png',
      'img://gui/maps/icons/vehicleTypes/white/heavyTank.png',
      'img://gui/maps/icons/library/marksOnGun/mark_2.png'
    ]);
  });

  it('names the tank', () => {
    expect(render().textContent).toContain('Tiger I');
  });

  it('shows the current percent', () => {
    expect(render().textContent).toContain('85,20 %');
  });

  it('shows the damage of the battles in the cards and the table', () => {
    expect(render().textContent).toContain('4 500');
  });

  it('draws the chart with plain elements, no SVG', () => {
    expect(render().querySelectorAll('svg')).toHaveLength(0);
  });

  it('writes plain minus signs and spaces, never the typographic ones', () => {
    expect(render().textContent).not.toMatch(/[−\u202F]/);
  });
});
