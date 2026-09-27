// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

import { $state, $view, receiveState, SECTION } from '../../../../../../entities/window-state';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { SIDEBAR } from '../../../../config';
import { useSidebar } from '../use-sidebar';

const sample = readFileSync(path.resolve(import.meta.dirname, '../../../../../../shared/api/protocol/_tests/fixtures/state.sample.json'), 'utf8');

beforeEach(() => {
  $state.set(null);
  $view.set({ section: SECTION.components, componentId: null });
  receiveState(sample);
});

describe(useSidebar, () => {
  it('titles every group and marks the selected component', () => {
    const hook = renderHook(useSidebar);
    const items = hook.current().groups.flatMap((group) => group.items);

    expect(hook.current().groups.every((group) => group.titleKey !== SIDEBAR.otherGroupTitle)).toBe(true);
    expect(items.filter((item) => item.active)).toHaveLength(1);
    expect(items[0]?.active).toBe(true);
  });

  it('moves the mark to the component that was opened', async () => {
    const hook = renderHook(useSidebar);
    const target = hook.current().groups.at(-1)?.items.at(-1);

    hook.run(() => target?.open());
    await hook.settle();

    const active = hook
      .current()
      .groups.flatMap((group) => group.items)
      .filter((item) => item.active);

    expect(active.map((item) => item.component.id)).toEqual([target?.component.id]);
  });

  it('leaves no component marked while another section is open', async () => {
    const hook = renderHook(useSidebar);

    hook.run(() => hook.current().links[0]?.open());
    await hook.settle();

    expect(hook.current().links.map((link) => link.active)).toEqual([true, false]);

    expect(
      hook
        .current()
        .groups.flatMap((group) => group.items)
        .some((item) => item.active)
    ).toBe(false);
  });
});
