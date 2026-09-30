import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { GamefaceMock } from '../../../../../shared/api/gameface/mock';

import { GAMEFACE } from '../../../../../shared/api/gameface';
import { createGamefaceMock, installGamefaceMock } from '../../../../../shared/api/gameface/mock';
import { addEscapeLayer } from '../../../../../shared/lib/escape-stack';
import { watchEscape } from '../escape-answer';

let mock: GamefaceMock;

const sentTypes = (): string[] =>
  mock
    .sent()
    .map((raw): { type: string } => JSON.parse(raw))
    .map((message) => message.type);

beforeEach(() => {
  mock = createGamefaceMock({ state: '', clientSize: () => ({ width: 1920, height: 1080 }), onSend: () => null });
  installGamefaceMock(mock);
});

afterEach(() => {
  Object.values(GAMEFACE.globals).forEach((name) => Reflect.deleteProperty(globalThis, name));
});

describe(watchEscape, () => {
  it('asks the mod to close the window when nothing is open to step back from', () => {
    const watch = watchEscape();

    watch(1);

    expect(sentTypes()).toEqual(['close']);
  });

  it('dismisses the open layer and tells the mod the Esc is taken', () => {
    const watch = watchEscape();
    const dismissed: string[] = [];
    const remove = addEscapeLayer({ kind: 'popover', onEscape: () => dismissed.push('popover') });

    watch(1);
    remove();

    expect(dismissed).toEqual(['popover']);
    expect(sentTypes()).toEqual(['escape']);
  });

  it('answers each Esc once however often the model repeats it', () => {
    const watch = watchEscape();

    watch(1);
    watch(1);

    expect(sentTypes()).toEqual(['close']);
  });

  it('leaves the number the page starts with unanswered', () => {
    const watch = watchEscape();

    watch(0);
    watch(null);

    expect(sentTypes()).toEqual([]);
  });
});
