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

describe(bindFindKey, () => {
  it('finds on Ctrl+F and keeps the key from the engine', () => {
    const found: boolean[] = [];
    const unbind = bindFindKey({ root: document, onFind: () => found.push(true) });
    const press = new KeyboardEvent('keydown', { key: 'f', keyCode: 70, ctrlKey: true, cancelable: true });

    document.dispatchEvent(press);
    unbind();

    expect(found).toEqual([true]);
    expect(press.defaultPrevented).toBe(true);
  });
});
