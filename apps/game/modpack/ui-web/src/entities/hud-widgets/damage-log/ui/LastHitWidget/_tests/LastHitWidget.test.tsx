// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../../shared/lib/testing/widget-fixture';
import { lastHitSchema } from '../../../model/schemas';
import { LastHitWidget } from '../LastHitWidget';

const sources = (html: HTMLElement) => [...html.querySelectorAll('img')].map((image) => image.getAttribute('src'));

const data = lastHitSchema.parse(readWidgetFixture('last_hit'));

describe(LastHitWidget, () => {
  it('shows the attacker, the damage and the shell of the last hit', () => {
    const html = render(<LastHitWidget data={data} />).container;

    expect(html.textContent).toContain('KV-1');
    expect(html.textContent).toContain('-310');
    expect(sources(html)).toContain('img://gui/maps/icons/vehicleTypes/red/heavyTank.png');
  });
});
