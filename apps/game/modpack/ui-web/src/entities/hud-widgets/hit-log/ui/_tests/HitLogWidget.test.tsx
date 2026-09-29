// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { hitLogSchema } from '../../model/schemas';
import { HitLogWidget } from '../HitLogWidget';

describe(HitLogWidget, () => {
  it('lists the own hits with their outcome, target class and the HP left', () => {
    const html = mount({ Component: HitLogWidget, props: { data: hitLogSchema.parse(readWidgetFixture('hit_log')) } });

    expect(html.textContent).toContain('KV-1');
    expect(html.textContent).toContain('280');
    expect(html.textContent).toContain('360');
    expect(imageSources(html)).toContain('img://gui/maps/icons/library/critical_damage/hit_ricochet.png');
    expect(imageSources(html)).toContain('img://gui/maps/icons/vehicleTypes/red/heavyTank.png');
  });
});
