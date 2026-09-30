// @vitest-environment jsdom
import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import type { HudSampleProps } from '../HudSample.types';

import { imageSources, mount as mountComponent } from '../../../../../../shared/lib/testing/mount';
import { readWidget } from '../../../../../../shared/lib/testing/widget-fixture';
import { WIDGET_FIXTURE } from '../../../../../../shared/lib/testing/widget-fixture/widget-fixture.constants';
import { HudSample } from '../HudSample';

const KINDS = readdirSync(WIDGET_FIXTURE.dir).map((file) => file.replace('.sample.json', ''));

const CROSSHAIR_MARK = '<img src="img://gui/maps/icons/otmetki/crosshair/dot/dot_32.png" width="32" height="32"/>';

const mount = (props: HudSampleProps): HTMLElement => mountComponent({ Component: HudSample, props });

describe(HudSample, () => {
  it.each(KINDS)('draws the %s preview widget with the HUD renderer', (kind) => {
    const html = mount({ widget: readWidget(kind) });

    expect(html.firstElementChild?.firstElementChild?.childElementCount).toBeGreaterThan(0);
  });

  it('draws a preview without a widget from its rich text', () => {
    const html = mount({ text: CROSSHAIR_MARK });

    expect(imageSources(html)).toEqual(['img://gui/maps/icons/otmetki/crosshair/dot/dot_32.png']);
  });

  it('keeps an image preview square at its own size', () => {
    const html = mount({ text: CROSSHAIR_MARK });

    const image = html.querySelector('img');

    expect(image?.style.width).toBe('32rem');
    expect(image?.style.height).toBe('32rem');
  });

  it('draws nothing for a panel without a preview', () => {
    const html = mount({ text: '', widget: null });

    expect(html.childElementCount).toBe(0);
  });
});
