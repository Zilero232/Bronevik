// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { bindFindKey, isFindKey } from '../find-key';

describe(isFindKey, () => {
  it('takes Ctrl+F by its key code whatever the keyboard layout', () => {
    const russianLayout = { ctrlKey: true, key: 'а', keyCode: 70 };

    expect(isFindKey(russianLayout)).toBe(true);
  });

  it('takes Ctrl+F by its key when the engine sends no key code', () => {
    const noKeyCode = { ctrlKey: true, key: 'F', keyCode: 0 };

    expect(isFindKey(noKeyCode)).toBe(true);
  });

  it('leaves a plain F to the text field', () => {
    const plain = { ctrlKey: false, key: 'f', keyCode: 70 };

    expect(isFindKey(plain)).toBe(false);
  });
});

const ctrlF = () => new KeyboardEvent('keydown', { key: 'f', keyCode: 70, ctrlKey: true, cancelable: true });

const pressBound = (press: KeyboardEvent, onFind: () => void = () => undefined): void => {
  const unbind = bindFindKey({ root: document, onFind });

  document.dispatchEvent(press);
  unbind();
};

describe(bindFindKey, () => {
  it('finds on Ctrl+F', () => {
    const found: boolean[] = [];

    pressBound(ctrlF(), () => found.push(true));

    expect(found).toEqual([true]);
  });

  it('keeps Ctrl+F from the engine', () => {
    const press = ctrlF();

    pressBound(press);

    expect(press.defaultPrevented).toBe(true);
  });
});
