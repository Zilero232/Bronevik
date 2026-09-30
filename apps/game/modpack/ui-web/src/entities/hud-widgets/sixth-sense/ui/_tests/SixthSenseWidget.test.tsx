// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { sixthSenseSchema } from '../../model/schemas';
import { SixthSenseWidget } from '../SixthSenseWidget';

const data = sixthSenseSchema.parse(readWidgetFixture('sixth_sense'));

describe(SixthSenseWidget, () => {
  it('draws our own lamp', () => {
    const html = mount({ Component: SixthSenseWidget, props: { data } });

    expect(imageSources(html)).toEqual(['img://gui/maps/icons/otmetki/sixth_sense/icons/lamp_64.png']);
  });

  it('counts the lamp time down in seconds inside a ring', () => {
    const html = mount({ Component: SixthSenseWidget, props: { data } });

    expect(html.textContent).toBe('7');
    expect(html.querySelectorAll('circle')).toHaveLength(2);
  });
});
