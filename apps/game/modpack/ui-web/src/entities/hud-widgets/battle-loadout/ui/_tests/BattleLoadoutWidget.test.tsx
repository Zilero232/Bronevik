// @vitest-environment jsdom
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { describe, expect, it } from 'vitest';

import { HudPointerContext } from '../../../../../shared/lib/hud-pointer';
import { imageSources } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { battleLoadoutSchema } from '../../model/schemas';
import { BattleLoadoutWidget } from '../BattleLoadoutWidget';

const data = battleLoadoutSchema.parse(readWidgetFixture('battle_loadout'));

const draw = (container: HTMLElement, pointer: boolean): void => {
  void act(() => {
    render(
      <HudPointerContext.Provider value={pointer}>
        <BattleLoadoutWidget data={data} />
      </HudPointerContext.Provider>,
      container
    );
  });
};

const hover = (container: HTMLElement, event: string): void => {
  const item = container.querySelectorAll('img')[1]?.parentElement;

  void act(() => {
    item?.dispatchEvent(new MouseEvent(event));
  });
};

describe(BattleLoadoutWidget, () => {
  it('draws the equipment as client icons with its overlay and the specialisation star, no names', () => {
    const container = document.createElement('div');

    draw(container, false);

    expect(imageSources(container)).toEqual([
      'img://gui/maps/icons/artefact/turbocharger.png',
      'img://gui/maps/icons/artefact/improvedVentilation.png',
      'img://gui/maps/icons/quests/bonuses/small/equipmentPlus_overlay.png',
      'img://gui/maps/icons/artefact/rammer.png'
    ]);

    expect(container.querySelectorAll('svg')).toHaveLength(2);
    expect(container.textContent).toBe('');
  });

  it('explains the item under the pointer until the pointer leaves it', () => {
    const container = document.createElement('div');

    draw(container, true);
    hover(container, 'mouseenter');

    expect(container.textContent).toContain('Улучшенная вентиляция');
    expect(container.textContent).toContain('+5 % к основным навыкам экипажа.');

    hover(container, 'mouseleave');

    expect(container.textContent).toBe('');
  });

  it('drops the tooltip when the panel stops taking the pointer and does not bring it back with it', () => {
    const container = document.createElement('div');

    draw(container, true);
    hover(container, 'mouseenter');
    draw(container, false);

    expect(container.textContent).toBe('');

    draw(container, true);

    expect(container.textContent).toBe('');
  });
});
