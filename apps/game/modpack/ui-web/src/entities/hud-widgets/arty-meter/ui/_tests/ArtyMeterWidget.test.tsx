// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { artyView } from '../../lib/arty-view';
import { artyMeterSchema } from '../../model/schemas';
import { ArtyMeterWidget } from '../ArtyMeterWidget';

const data = artyMeterSchema.parse(readWidgetFixture('arty_meter'));

const withTotal = (total: number) => ({ ...data, battle: { ...data.battle, total } });

describe(artyView, () => {
  it('fills the thermometer by the shells that landed', () => {
    const view = artyView(data);

    expect(view).toMatchObject({ level: 42, tone: 'warning' });
  });

  it('caps the scale at ten and turns red', () => {
    const view = artyView(withTotal(14));

    expect(view).toMatchObject({ level: 84, tone: 'received' });
  });
});

describe(ArtyMeterWidget, () => {
  it('lists the damage of the battle and the day totals', () => {
    const html = render(<ArtyMeterWidget data={data} />).container;

    expect(html.textContent).toContain('-740');
    expect(html.textContent).toContain('7 · 17 · -2 310');
  });
});
