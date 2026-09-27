// @vitest-environment jsdom
import { h } from 'preact';
import { afterEach, describe, expect, it } from 'vitest';

import { mountOnce } from '../mount-once';

const ID = 'otmetki-test-host';

afterEach(() => {
  document.body.innerHTML = '';
});

describe(mountOnce, () => {
  it('creates the host when it is missing and renders into it', () => {
    mountOnce({ id: ID, node: h('span', null, 'first') });

    expect(document.getElementById(ID)?.textContent).toBe('first');
    expect(document.body.children).toHaveLength(1);
  });

  it('renders into a host the page already has without adding another', () => {
    document.body.innerHTML = `<div id="${ID}"></div>`;
    mountOnce({ id: ID, node: h('span', null, 'page') });

    expect(document.querySelectorAll(`#${ID}`)).toHaveLength(1);
    expect(document.getElementById(ID)?.textContent).toBe('page');
  });

  it('mounts once when a second copy of the script runs', () => {
    mountOnce({ id: ID, node: h('span', null, 'first') });
    mountOnce({ id: ID, node: h('span', null, 'second') });

    expect(document.getElementById(ID)?.textContent).toBe('first');
  });

  it('removes a host it created on unmount, so the next mount starts over', () => {
    const unmount = mountOnce({ id: ID, node: h('span', null, 'first') });

    unmount();

    expect(document.getElementById(ID)).toBeNull();

    mountOnce({ id: ID, node: h('span', null, 'again') });

    expect(document.getElementById(ID)?.textContent).toBe('again');
  });

  it('keeps a host the page owns on unmount and empties it', () => {
    document.body.innerHTML = `<div id="${ID}"></div>`;

    const unmount = mountOnce({ id: ID, node: h('span', null, 'page') });

    unmount();

    expect(document.getElementById(ID)?.textContent).toBe('');
  });
});
