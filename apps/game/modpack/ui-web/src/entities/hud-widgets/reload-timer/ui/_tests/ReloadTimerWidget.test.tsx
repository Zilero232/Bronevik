// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { mount } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { reloadTimerSchema } from '../../model/schemas';
import { ReloadTimerWidget } from '../ReloadTimerWidget';

const data = reloadTimerSchema.parse(readWidgetFixture('reload_timer'));

describe(ReloadTimerWidget, () => {
  it('shows the seconds left with one decimal and the magazine', () => {
    const html = mount({ Component: ReloadTimerWidget, props: { data } });

    expect(html.textContent).toContain('3.2');
    expect(html.textContent).toContain('3/4');
  });
});
