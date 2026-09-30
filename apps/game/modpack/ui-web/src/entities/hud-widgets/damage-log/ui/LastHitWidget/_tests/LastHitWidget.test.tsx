// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../../shared/lib/testing/widget-fixture';
import { lastHitSchema } from '../../../model/schemas';
import { LastHitWidget } from '../LastHitWidget';

describe(LastHitWidget, () => {
  it('shows the attacker, the damage and the shell of the last hit', () => {
    const html = mount({ Component: LastHitWidget, props: { data: lastHitSchema.parse(readWidgetFixture('last_hit')) } });

    expect(html.textContent).toContain('KV-1');
    expect(html.textContent).toContain('-310');
    expect(imageSources(html)).toContain('img://gui/maps/icons/vehicleTypes/red/heavyTank.png');
  });
});
