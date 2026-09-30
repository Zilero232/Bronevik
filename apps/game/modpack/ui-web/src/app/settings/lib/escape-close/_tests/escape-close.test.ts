// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import { bindEscapeClose, isEscape } from '..';
import { createGamefaceMock, installGamefaceMock } from '../../../../../shared/api/gameface/mock';
import { forgetReports } from '../../../../../shared/lib/page-diag';

const install = () => {
  const mock = createGamefaceMock({ state: '', clientSize: () => ({ width: 1920, height: 1080 }), onSend: () => null });

  installGamefaceMock(mock);

  return mock;
};

const types = (sent: string[]): string[] => sent.map((raw): { type: string } => JSON.parse(raw)).map((message) => message.type);

afterEach(() => {
  forgetReports();
});

describe(isEscape, () => {
  it('knows Esc by its key or, on an engine without `key`, by its key code', () => {
    expect(isEscape({ key: 'Escape', keyCode: 0 })).toBe(true);
    expect(isEscape({ key: '', keyCode: 27 })).toBe(true);
    expect(isEscape({ key: 'Enter', keyCode: 13 })).toBe(false);
  });
});

describe(bindEscapeClose, () => {
  it('closes the window on Esc and keeps the key from the page', () => {
    const mock = install();
    const unbind = bindEscapeClose(document);
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });

    document.body.dispatchEvent(escape);
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));

    expect(escape.defaultPrevented).toBe(true);
    expect(types(mock.sent())).toEqual(['diag', 'close']);

    unbind();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(types(mock.sent())).toEqual(['diag', 'close']);
  });
});
