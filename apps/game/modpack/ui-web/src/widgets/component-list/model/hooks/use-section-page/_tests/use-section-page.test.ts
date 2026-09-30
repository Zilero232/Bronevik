// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

import { $state, $view, CONTEXT_FILTER, receiveState, SECTION_NAV } from '../../../../../../entities/window-state';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useSectionPage } from '../use-section-page';

const sample = readFileSync(path.resolve(import.meta.dirname, '../../../../../../shared/api/protocol/_tests/fixtures/state.sample.json'), 'utf8');

beforeEach(() => {
  $state.set(null);
  $view.set({ section: SECTION_NAV.first, expanded: [], context: CONTEXT_FILTER.all });
  receiveState(sample);
});

describe(useSectionPage, () => {
  it('lists the page cards in columns and offers the filter only on a mixed page', () => {
    const marks = renderHook(() => useSectionPage({ section: 'marks', columns: 2 }));
    const battle = renderHook(() => useSectionPage({ section: 'battle', columns: 1 }));

    expect(marks.current().columns.map((column) => column.items.map(({ component }) => component.id))).toEqual([['marks_panel'], ['session_stats']]);
    expect(marks.current().showFilter).toBe(true);
    expect(battle.current().showFilter).toBe(false);
    expect(battle.current()).toMatchObject({ total: 2, enabled: 1, empty: false });
  });

  it('filters by where a component works and tells an empty filter from an empty page', async () => {
    const marks = renderHook(() => useSectionPage({ section: 'marks', columns: 1 }));

    marks.run(() => marks.current().setContext(CONTEXT_FILTER.hangar));
    await marks.settle();

    expect(marks.current().columns[0]?.items.map(({ component }) => component.id)).toEqual(['session_stats']);
    expect(renderHook(() => useSectionPage({ section: 'streamer', columns: 1 })).current()).toMatchObject({ empty: true, filteredEmpty: false });
  });
});
