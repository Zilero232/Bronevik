import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../../shared/lib/testing/widget-fixture';
import { consumablesSchema, reloadTimerSchema } from '../../../model/schemas';
import { consumablesView, reloadView } from '../consumables-view';

describe(consumablesView, () => {
  it('drains the ring over the cooldown and greys out a spent slot', () => {
    const view = consumablesView(consumablesSchema.parse(readWidgetFixture('consumables')));

    expect(view.slots[1]).toMatchObject({ progress: 12 / 90, seconds: '12', alpha: 1 });

    expect(
      consumablesView({ slots: [{ icon: null, quantity: 0, remaining: 0, total: 0, ready: false }], shells: [], stats: [] }).slots[0]?.alpha
    ).toBe(0.35);
  });
});

describe(reloadView, () => {
  it('fills the bar as the gun reloads and shows the magazine', () => {
    const data = reloadTimerSchema.parse(readWidgetFixture('reload_timer'));

    expect(reloadView(data)).toEqual({ visible: true, progress: 1 - 3.2 / 7.8, seconds: '3.2', ready: false, clip: '3/4' });
    expect(reloadView({ ...data, ready: true, left: 0 }).visible).toBe(false);
  });
});
