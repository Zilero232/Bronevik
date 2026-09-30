// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { mount } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { artyView } from '../../lib/arty-view';
import { artyMeterSchema } from '../../model/schemas';
import { ArtyMeterWidget } from '../ArtyMeterWidget';

const data = artyMeterSchema.parse(readWidgetFixture('arty_meter'));

describe(ArtyMeterWidget, () => {
  it('fills the thermometer by the shells that landed and lists what they did', () => {
    const html = mount({ Component: ArtyMeterWidget, props: { data } });

    expect(artyView(data)).toMatchObject({ level: Math.round((5 / 10) * 84), tone: 'warning' });
    expect(html.textContent).toContain('-740');
    expect(html.textContent).toContain('7 · 17 · -2 310');
  });

  it('caps the scale at ten and turns red', () => {
    expect(artyView({ ...data, battle: { ...data.battle, total: 14 } })).toMatchObject({ level: 84, tone: 'received' });
  });
});
