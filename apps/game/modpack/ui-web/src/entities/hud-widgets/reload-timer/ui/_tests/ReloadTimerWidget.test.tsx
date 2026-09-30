// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { reloadTimerSchema } from '../../model/schemas';
import { ReloadTimerWidget } from '../ReloadTimerWidget';

const data = reloadTimerSchema.parse(readWidgetFixture('reload_timer'));

describe(ReloadTimerWidget, () => {
  it('shows the seconds left with one decimal and the magazine', () => {
    const html = render(<ReloadTimerWidget data={data} />).container;

    expect(html.textContent).toContain('3.2');
    expect(html.textContent).toContain('3/4');
  });
});
