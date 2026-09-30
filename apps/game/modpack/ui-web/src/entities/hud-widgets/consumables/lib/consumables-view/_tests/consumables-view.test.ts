import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../../shared/lib/testing/widget-fixture';
import { consumablesSchema, reloadTimerSchema } from '../../../model/schemas';
import { consumablesView, reloadView } from '../consumables-view';

const consumables = consumablesSchema.parse(readWidgetFixture('consumables'));
const reload = reloadTimerSchema.parse(readWidgetFixture('reload_timer'));

const spentSlot = { icon: null, quantity: 0, remaining: 0, total: 0, ready: false };

describe(consumablesView, () => {
  it('drains the ring over the cooldown', () => {
    const view = consumablesView(consumables);

    expect(view.slots[1]).toMatchObject({ progress: expect.closeTo(0.1333, 4), seconds: '12', alpha: 1 });
  });

  it('greys out a spent slot', () => {
    const view = consumablesView({ slots: [spentSlot], shells: [], stats: [] });

    expect(view.slots[0]?.alpha).toBe(0.35);
  });
});

describe(reloadView, () => {
  it('fills the bar as the gun reloads and shows the magazine', () => {
    const view = reloadView(reload);

    expect(view).toEqual({ visible: true, progress: expect.closeTo(0.5897, 4), seconds: '3.2', ready: false, clip: '3/4' });
  });

  it('hides the bar once the gun is loaded', () => {
    const view = reloadView({ ...reload, ready: true, left: 0 });

    expect(view.visible).toBe(false);
  });
});
