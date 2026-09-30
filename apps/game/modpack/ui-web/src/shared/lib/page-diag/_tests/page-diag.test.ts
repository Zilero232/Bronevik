import { afterEach, describe, expect, it } from 'vitest';

import { forgetReports, PAGE_DIAG, reportOnce, round2 } from '..';
import { createGamefaceMock, installGamefaceMock } from '../../../api/gameface/mock';

const install = () => {
  const mock = createGamefaceMock({ state: '', clientSize: () => ({ width: 1920, height: 1080 }), onSend: () => null });

  installGamefaceMock(mock);

  return mock;
};

afterEach(() => {
  forgetReports();
});

describe(reportOnce, () => {
  it('sends one diag line per kind to the game log', () => {
    const mock = install();

    expect(reportOnce({ kind: 'wheel', text: 'deltaY 100' })).toBe(true);
    expect(reportOnce({ kind: 'wheel', text: 'deltaY -100' })).toBe(false);
    reportOnce({ kind: 'mouse', text: 'x'.repeat(PAGE_DIAG.maxChars * 2) });

    const sent = mock.sent().map((raw): { type: string; text: string } => JSON.parse(raw));

    expect(sent[0]).toEqual({ type: 'diag', text: 'wheel: deltaY 100' });
    expect(sent).toHaveLength(2);
    expect(sent[1]?.text).toHaveLength(PAGE_DIAG.maxChars);
  });

  it('rounds the numbers it reports', () => {
    expect(round2(1.23456)).toBe(1.23);
  });
});
