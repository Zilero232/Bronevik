import { h, render } from 'preact';
import { act } from 'preact/test-utils';

import type { MountInput } from './mount.types';

export const mount = <Props extends object>({ Component, props }: MountInput<Props>): HTMLElement => {
  const container = document.createElement('div');

  void act(() => {
    render(h(Component, props), container);
  });

  return container;
};

export const imageSources = (element: HTMLElement): (string | null)[] =>
  [...element.querySelectorAll('img')].map((image) => image.getAttribute('src'));
