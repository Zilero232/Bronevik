// @vitest-environment jsdom
import { h } from 'preact';
import { afterEach, describe, expect, it } from 'vitest';

import { mountOnce } from '../mount-once';

const ID = 'otmetki-test-host';

const mountText = (text: string) => mountOnce({ id: ID, node: h('span', null, text) });

const hostText = () => document.getElementById(ID)?.textContent;

const givePageHost = (): void => {
  document.body.innerHTML = `<div id="${ID}"></div>`;
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe(mountOnce, () => {
  it('renders into the host it creates when the page has none', () => {
    mountText('first');

    expect(hostText()).toBe('first');
  });

  it('adds exactly one host to a page that has none', () => {
    mountText('first');

    expect(document.body.children).toHaveLength(1);
  });

  it('renders into a host the page already has', () => {
    givePageHost();

    mountText('page');

    expect(hostText()).toBe('page');
  });

  it('adds no second host when the page already has one', () => {
    givePageHost();

    mountText('page');

    expect(document.querySelectorAll(`#${ID}`)).toHaveLength(1);
  });

  it('mounts once when a second copy of the script runs', () => {
    mountText('first');

    mountText('second');

    expect(hostText()).toBe('first');
  });

  it('removes a host it created on unmount', () => {
    const unmount = mountText('first');

    unmount();

    expect(document.getElementById(ID)).toBeNull();
  });

  it('starts over on the next mount after an unmount', () => {
    const unmount = mountText('first');

    unmount();

    mountText('again');

    expect(hostText()).toBe('again');
  });

  it('keeps a host the page owns on unmount and empties it', () => {
    givePageHost();
    const unmount = mountText('page');

    unmount();

    expect(hostText()).toBe('');
  });
});
