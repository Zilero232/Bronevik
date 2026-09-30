import { afterEach, describe, expect, it } from 'vitest';

import type { EscapeLayerKind } from '../escape-stack.types';

import { addEscapeLayer, stepBack } from '../escape-stack';

const removers: (() => void)[] = [];

const layer = (kind: EscapeLayerKind, escaped: string[], name: string = kind): void => {
  removers.push(addEscapeLayer({ kind, onEscape: () => escaped.push(name) }));
};

afterEach(() => {
  removers.splice(0).forEach((remove) => remove());
});

describe(stepBack, () => {
  it('has nothing to step back from when no layer is open', () => {
    const stepped = stepBack();

    expect(stepped).toBe(false);
  });

  it('dismisses a confirmation before a list and a list before a field', () => {
    const escaped: string[] = [];

    layer('field', escaped);
    layer('confirm', escaped);
    layer('popover', escaped);

    stepBack();

    expect(escaped).toEqual(['confirm']);
  });

  it('dismisses the latest of two layers of one kind first', () => {
    const escaped: string[] = [];

    layer('popover', escaped, 'first');
    layer('popover', escaped, 'second');

    stepBack();

    expect(escaped).toEqual(['second']);
  });

  it('forgets a layer once it is removed', () => {
    const escaped: string[] = [];
    const remove = addEscapeLayer({ kind: 'confirm', onEscape: () => escaped.push('confirm') });

    layer('field', escaped);

    remove();
    stepBack();

    expect(escaped).toEqual(['field']);
  });
});
