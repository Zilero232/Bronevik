import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../../shared/lib/testing/widget-fixture';
import { reloadTimerSchema } from '../../../model/schemas';
import { reloadView } from '../reload-view';

const reload = reloadTimerSchema.parse(readWidgetFixture('reload_timer'));

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
