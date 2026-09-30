// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { hitLogSchema } from '../../model/schemas';
import { HitLogWidget } from '../HitLogWidget';

const sources = (html: HTMLElement) => [...html.querySelectorAll('img')].map((image) => image.getAttribute('src'));

const fixture = hitLogSchema.parse(readWidgetFixture('hit_log'));

const withNote = (note: string) => fixture.rows.map((row) => ({ ...row, note }));

describe(HitLogWidget, () => {
  it('lists the own hits with their target, damage and the HP left', () => {
    const html = render(<HitLogWidget data={fixture} />).container;

    expect(html.textContent).toContain('KV-1');
    expect(html.textContent).toContain('280');
    expect(html.textContent).toContain('360');
  });

  it('shows the outcome and the target class of each hit as client icons', () => {
    const html = render(<HitLogWidget data={fixture} />).container;

    expect(sources(html)).toContain('img://gui/maps/icons/library/critical_damage/hit_ricochet.png');
    expect(sources(html)).toContain('img://gui/maps/icons/vehicleTypes/red/heavyTank.png');
  });

  it('leaves the class and the HP left out of a short row while Alt is up', () => {
    const html = render(<HitLogWidget data={{ ...fixture, detail: 'short' as const }} />).container;

    expect(html.textContent).toContain('KV-1');
    expect(html.textContent).not.toContain('360');
    expect(sources(html)).not.toContain('img://gui/maps/icons/vehicleTypes/red/heavyTank.png');
  });

  it('keeps the HP left and adds the note while Alt is held', () => {
    const data = { ...fixture, detail: 'extended' as const, rows: withNote('БП криты x2') };

    const html = render(<HitLogWidget data={data} />).container;

    expect(html.textContent).toContain('360');
    expect(html.textContent).toContain('БП криты x2');
  });
});
