// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

import { $query, $state, $view, CONTEXT_FILTER, receiveState, SECTION, SECTION_NAV } from '../../../../../../entities/window-state';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useHeader } from '../use-header';

const sample = readFileSync(path.resolve(import.meta.dirname, '../../../../../../shared/api/protocol/_tests/fixtures/state.sample.json'), 'utf8');

beforeEach(() => {
  $state.set(null);
  $query.set('');
  $view.set({ section: SECTION_NAV.first, expanded: [], context: CONTEXT_FILTER.all });
  receiveState(sample);
});

describe(useHeader, () => {
  it('shows the binding state and opens the data page from it', () => {
    const hook = renderHook(useHeader);

    expect(hook.current().account).toMatchObject({ bound: false, title: 'accountUnbound' });

    hook.run(() => hook.current().openAccount());

    expect($view.get().section).toBe(SECTION.data);
  });

  it('types into the shared search and clears it', async () => {
    const hook = renderHook(useHeader);

    hook.run(() => hook.current().setQuery('лог'));
    await hook.settle();

    expect(hook.current()).toMatchObject({ query: 'лог', searching: true });

    hook.run(() => hook.current().clearQuery());
    await hook.settle();

    expect(hook.current().searching).toBe(false);
  });
});
