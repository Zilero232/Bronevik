// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

import { $state, $view, CONTEXT_FILTER, receiveState, SECTION_NAV } from '../../../../../../entities/window-state';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useSectionCards } from '../use-section-cards';

const sample = readFileSync(path.resolve(import.meta.dirname, '../../../../../../shared/api/protocol/_tests/fixtures/state.sample.json'), 'utf8');

beforeEach(() => {
  $state.set(null);
  $view.set({ section: SECTION_NAV.first, expanded: [], context: CONTEXT_FILTER.hangar });
  receiveState(sample);
});

describe(useSectionCards, () => {
  it('lists the cards of a tool page whatever the context filter says', () => {
    const hud = renderHook(() => useSectionCards({ section: 'hud', columns: 1 }));

    expect(hud.current().empty).toBe(false);
    expect(hud.current().columns[0]?.items.map(({ component }) => component.id)).toEqual(['hud_layouts']);
    expect(renderHook(() => useSectionCards({ section: 'streamer', columns: 1 })).current().empty).toBe(true);
  });
});
