// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { $invalid, $state } from '../../../../../../entities/window-state';
import { GAMEFACE } from '../../../../../../shared/api/gameface';
import { createGamefaceMock, installGamefaceMock } from '../../../../../../shared/api/gameface/mock';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useApp } from '../use-app';

const sample = readFileSync(path.resolve(import.meta.dirname, '../../../../../../shared/api/protocol/_tests/fixtures/state.sample.json'), 'utf8');

const install = (state: string) => {
  const mock = createGamefaceMock({ state, clientSize: () => ({ width: 1920, height: 1080 }), onSend: () => null });

  installGamefaceMock(mock);

  return mock;
};

beforeEach(() => {
  $state.set(null);
  $invalid.set(false);
});

afterEach(() => {
  Object.values(GAMEFACE.globals).forEach((name) => Reflect.deleteProperty(globalThis, name));
});

describe(useApp, () => {
  it('announces itself to the mod and takes the state it pushes', async () => {
    const mock = install(sample);
    const hook = renderHook(useApp);

    await hook.settle();
    await hook.settle();

    const sent = mock.sent().map((message): { type: string } => JSON.parse(message));

    expect(sent.filter((message) => message.type !== 'diag')).toEqual([{ type: 'ready' }]);
    expect(sent.map((message) => message.type)).toContain('diag');
    expect(hook.current().state?.revision).toBe(JSON.parse(sample).revision);
  });

  it('shows the invalid-state note when the push does not parse', async () => {
    install('{"v": 99}');

    const hook = renderHook(useApp);

    await hook.settle();
    await hook.settle();

    expect(hook.current().state).toBeNull();
    expect(hook.current().placeholderKey).toBe('invalidState');
  });
});
