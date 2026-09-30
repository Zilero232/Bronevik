// @vitest-environment jsdom
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { describe, expect, it } from 'vitest';

import { HudPointerContext } from '../../../../../shared/lib/hud-pointer';
import { imageSources } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { BATTLE_LOADOUT } from '../../config';
import { battleLoadoutSchema } from '../../model/schemas';
import { BattleLoadoutWidget } from '../BattleLoadoutWidget';

import s from '../BattleLoadoutWidget.module.scss';

const data = battleLoadoutSchema.parse(readWidgetFixture('battle_loadout'));

const draw = (container: HTMLElement, pointer: boolean, widget = data): HTMLElement => {
  void act(() => {
    render(
      <HudPointerContext.Provider value={pointer}>
        <BattleLoadoutWidget data={widget} />
      </HudPointerContext.Provider>,
      container
    );
  });

  return container;
};

const drawNew = (pointer: boolean, widget = data): HTMLElement => draw(document.createElement('div'), pointer, widget);

const itemOf = (container: HTMLElement, name: string): HTMLElement | undefined => {
  const index = data.items.findIndex((item) => item.name === name);

  return container.querySelectorAll<HTMLElement>(`.${s.item}`)[index];
};

const hover = (container: HTMLElement, event: string): void => {
  const item = container.querySelectorAll('img')[1]?.parentElement;

  void act(() => {
    item?.dispatchEvent(new MouseEvent(event));
  });
};

const spentAttention = () => {
  const [first, ...rest] = data.items;

  return { ...data, sets: [], items: [{ ...first, attention: true, used: true }, ...rest] };
};

describe(BattleLoadoutWidget, () => {
  it('draws the equipment and the directive as client icons with their overlays', () => {
    const container = drawNew(false);

    expect(imageSources(container)).toEqual([
      'img://gui/maps/icons/artefact/turbocharger.png',
      'img://gui/maps/icons/artefact/improvedVentilation.png',
      'img://gui/maps/icons/quests/bonuses/small/equipmentPlus_overlay.png',
      'img://gui/maps/icons/artefact/rammer.png',
      'img://gui/maps/icons/artefact/camouflageNet.png',
      'img://gui/maps/icons/artefact/rammer.png',
      'img://gui/maps/icons/artefact/battleBooster_overlay.png'
    ]);
  });

  it('draws the specialisation stars', () => {
    const container = drawNew(false);

    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('shows the active set of each switchable group and no item names', () => {
    const container = drawNew(false);

    expect(container.textContent).toBe('набор 2/2снаряды 1/2');
  });

  it('highlights the device the directive boosts and the device that is running', () => {
    const container = drawNew(false);

    expect(itemOf(container, 'Досылатель')?.classList.contains(s.boosted)).toBe(true);
    expect(itemOf(container, 'Маскировочная сеть')?.classList.contains(s.active)).toBe(true);
    expect(itemOf(container, 'Турбонагнетатель')?.classList.contains(s.active)).toBe(false);
  });

  it('marks a directive that does not affect the tank', () => {
    const container = drawNew(false, spentAttention());

    expect(container.textContent).toBe(BATTLE_LOADOUT.attentionMark);
  });

  it('dims a spent device', () => {
    const container = drawNew(false, spentAttention());

    expect(itemOf(container, 'Турбонагнетатель')?.classList.contains(s.used)).toBe(true);
  });

  it('explains the item under the pointer', () => {
    const container = drawNew(true);

    hover(container, 'mouseenter');

    expect(container.textContent).toContain('Улучшенная вентиляция');
    expect(container.textContent).toContain('+5 % к основным навыкам экипажа.');
  });

  it('hides the explanation once the pointer leaves the item', () => {
    const container = drawNew(true);

    hover(container, 'mouseenter');

    hover(container, 'mouseleave');

    expect(container.textContent).not.toContain('Улучшенная вентиляция');
  });

  it('drops the tooltip when the panel stops taking the pointer', () => {
    const container = drawNew(true);

    hover(container, 'mouseenter');

    draw(container, false);

    expect(container.textContent).not.toContain('Улучшенная вентиляция');
  });

  it('does not bring the tooltip back when the panel takes the pointer again', () => {
    const container = drawNew(true);

    hover(container, 'mouseenter');
    draw(container, false);

    draw(container, true);

    expect(container.textContent).not.toContain('Улучшенная вентиляция');
  });
});
