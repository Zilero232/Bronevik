import { describe, expect, it } from 'vitest';

import { isInteractiveTarget } from '../interactive-target';

const build = (html: string) => {
  const root = document.createElement('div');

  root.innerHTML = html;

  return root;
};

describe('isInteractiveTarget', () => {
  it('flags a click that lands inside a link or a button', () => {
    const root = build('<a href="/x"><span id="inner">x</span></a><button><b id="label">b</b></button>');

    expect(isInteractiveTarget(root.querySelector('#inner'))).toBe(true);
    expect(isInteractiveTarget(root.querySelector('#label'))).toBe(true);
  });

  it('lets a click on plain cell content through', () => {
    const root = build('<table><tr><td><span id="plain">1</span></td></tr></table>');

    expect(isInteractiveTarget(root.querySelector('#plain'))).toBe(false);
    expect(isInteractiveTarget(null)).toBe(false);
  });
});
