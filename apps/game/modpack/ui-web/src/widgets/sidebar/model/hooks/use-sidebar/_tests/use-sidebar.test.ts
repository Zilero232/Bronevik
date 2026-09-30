// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

import { $query, $state, $view, CONTEXT_FILTER, receiveState, SECTION, SECTION_NAV } from '../../../../../../entities/window-state';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useSidebar } from '../use-sidebar';

const sample = readFileSync(path.resolve(import.meta.dirname, '../../../../../../shared/api/protocol/_tests/fixtures/state.sample.json'), 'utf8');

beforeEach(() => {
  $state.set(null);
  $query.set('');
  $view.set({ section: SECTION_NAV.first, expanded: [], context: CONTEXT_FILTER.all });
  receiveState(sample);
});

describe(useSidebar, () => {
  it('lists the component pages with their on/total counts, then the tools', () => {
    const hook = renderHook(useSidebar);
    const { components, tools } = hook.current();

    expect(components.map(({ section, count }) => [section, count])).toEqual([
      ['battle', '1/2'],
      ['hangar', null],
      ['marks', '2/2'],
      ['replays', '1/1'],
      ['streamer', null],
      ['data', '1/1']
    ]);

    expect(tools.map(({ section }) => section)).toEqual([SECTION.profiles, SECTION.hud]);
    expect(components[0]?.active).toBe(true);
  });

  it('opens a page and marks nothing active while a search is shown', async () => {
    const hook = renderHook(useSidebar);

    hook.run(() => hook.current().tools[0]?.open());
    await hook.settle();

    expect($view.get().section).toBe(SECTION.profiles);
    expect(hook.current().tools[0]?.active).toBe(true);

    hook.run(() => $query.set('zoom'));
    await hook.settle();

    expect(hook.current().tools[0]?.active).toBe(false);
  });
});
