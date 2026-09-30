// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { battleLoadoutSchema } from '../../model/schemas';
import { BattleLoadoutWidget } from '../BattleLoadoutWidget';

describe(BattleLoadoutWidget, () => {
  it('draws the equipment as client icons with the bonus star, a name only where no icon exists', () => {
    const html = mount({ Component: BattleLoadoutWidget, props: { data: battleLoadoutSchema.parse(readWidgetFixture('battle_loadout')) } });

    expect(imageSources(html)).toEqual([
      'img://gui/maps/icons/artefact/turbocharger.png',
      'img://gui/maps/icons/artefact/improvedVentilation.png',
      'img://gui/maps/icons/artefact/rammer.png'
    ]);

    expect(html.querySelectorAll('svg')).toHaveLength(2);
  });
});
