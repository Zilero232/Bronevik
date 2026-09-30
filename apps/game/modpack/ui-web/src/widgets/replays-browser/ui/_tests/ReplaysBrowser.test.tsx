// @vitest-environment jsdom
import { act } from 'preact/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { pageSample } from '../../../../entities/replays/_tests/fixtures';
import { imageSources, mount } from '../../../../shared/lib/testing/mount';
import { REPLAYS_RU } from '../../config';
import { ReplaysBrowser } from '../ReplaysBrowser';

vi.mock('../../../../shared/api/protocol/protocol', () => ({ send: vi.fn(() => true) }));

const PAGE = pageSample();

const buttonNamed = (root: HTMLElement, text: string): HTMLButtonElement => {
  const found = [...root.querySelectorAll('button')].find((button) => button.textContent?.trim() === text);

  if (!found) {
    throw new Error(`no button «${text}»`);
  }

  return found;
};

describe(ReplaysBrowser, () => {
  it('draws the rows with the client images and the chosen replay with its stats', () => {
    const html = mount({ Component: ReplaysBrowser, props: { page: PAGE, enabled: true, onTurnOn: vi.fn() } });

    expect(imageSources(html)).toEqual(
      expect.arrayContaining(['img://gui/maps/icons/map/small/05_prohorovka.png', 'img://gui/maps/icons/map/stats/05_prohorovka.png'])
    );

    expect(html.textContent).toContain('Т-34');
    expect(html.textContent).toContain('Tiger I');
    expect(html.textContent).toContain(REPLAYS_RU.outcome_win);
    expect(buttonNamed(html, REPLAYS_RU.watch).disabled).toBe(false);
  });

  it('warns about a replay of another client version and does not offer to watch it', () => {
    const html = mount({ Component: ReplaysBrowser, props: { page: PAGE, enabled: true, onTurnOn: vi.fn() } });
    const second = PAGE.items[1];

    if (!second) {
      throw new Error('the sample needs two replays');
    }

    const row = [...html.querySelectorAll('button')].find((button) => button.textContent?.includes('Tiger I'));

    void act(() => row?.click());

    expect(html.textContent).toContain(second.version ?? '');
    expect(html.textContent).toContain(REPLAYS_RU.noResults);
    expect(buttonNamed(html, REPLAYS_RU.watch).disabled).toBe(true);
  });

  it('narrows the list to the nation picked in the filter bar', () => {
    const html = mount({ Component: ReplaysBrowser, props: { page: PAGE, enabled: true, onTurnOn: vi.fn() } });
    const trigger = [...html.querySelectorAll('button')].find((button) => button.textContent?.startsWith(REPLAYS_RU.filterNation));

    void act(() => trigger?.click());
    void act(() => buttonNamed(html, `${REPLAYS_RU.nation_germany}1`).click());

    expect(html.textContent).toContain('Tiger I');
    expect(html.textContent).not.toContain('Т-34');
  });

  it('offers to turn the component on when it is off', () => {
    const onTurnOn = vi.fn();
    const html = mount({ Component: ReplaysBrowser, props: { page: null, enabled: false, onTurnOn } });

    void act(() => buttonNamed(html, REPLAYS_RU.turnOn).click());

    expect(onTurnOn).toHaveBeenCalledOnce();
  });
});
