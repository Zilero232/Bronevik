// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { hitLogSchema } from '../../model/schemas';
import { HitLogWidget } from '../HitLogWidget';

const fixture = hitLogSchema.parse(readWidgetFixture('hit_log'));

const withNote = (note: string) => fixture.rows.map((row) => ({ ...row, note }));

describe(HitLogWidget, () => {
  it('lists the own hits with their target, damage and the HP left', () => {
    const html = mount({ Component: HitLogWidget, props: { data: fixture } });

    expect(html.textContent).toContain('KV-1');
    expect(html.textContent).toContain('280');
    expect(html.textContent).toContain('360');
  });

  it('shows the outcome and the target class of each hit as client icons', () => {
    const html = mount({ Component: HitLogWidget, props: { data: fixture } });

    expect(imageSources(html)).toContain('img://gui/maps/icons/library/critical_damage/hit_ricochet.png');
    expect(imageSources(html)).toContain('img://gui/maps/icons/vehicleTypes/red/heavyTank.png');
  });

  it('leaves the class and the HP left out of a short row while Alt is up', () => {
    const html = mount({ Component: HitLogWidget, props: { data: { ...fixture, detail: 'short' as const } } });

    expect(html.textContent).toContain('KV-1');
    expect(html.textContent).not.toContain('360');
    expect(imageSources(html)).not.toContain('img://gui/maps/icons/vehicleTypes/red/heavyTank.png');
  });

  it('keeps the HP left and adds the note while Alt is held', () => {
    const data = { ...fixture, detail: 'extended' as const, rows: withNote('БП криты x2') };

    const html = mount({ Component: HitLogWidget, props: { data } });

    expect(html.textContent).toContain('360');
    expect(html.textContent).toContain('БП криты x2');
  });
});
