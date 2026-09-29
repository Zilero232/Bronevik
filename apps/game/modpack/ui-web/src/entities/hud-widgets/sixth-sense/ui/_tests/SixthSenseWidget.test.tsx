// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { sixthSenseSchema } from '../../model/schemas';
import { SixthSenseWidget } from '../SixthSenseWidget';

describe(SixthSenseWidget, () => {
  it('draws our lamp inside a ring that counts the lamp time down', () => {
    const html = mount({ Component: SixthSenseWidget, props: { data: sixthSenseSchema.parse(readWidgetFixture('sixth_sense')) } });

    expect(imageSources(html)).toEqual(['img://gui/maps/icons/otmetki/sixth_sense/icons/lamp_64.png']);
    expect(html.textContent).toBe('7');
    expect(html.querySelectorAll('circle')).toHaveLength(2);
  });
});
