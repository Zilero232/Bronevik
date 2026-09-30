import { render } from '@testing-library/react';
import { createElement } from 'react';

import type { MountInput } from './mount.types';

export const mount = <Props extends object>({ Component, props }: MountInput<Props>): HTMLElement =>
  render(createElement(Component, props)).container;

export const imageSources = (element: HTMLElement): (string | null)[] =>
  [...element.querySelectorAll('img')].map((image) => image.getAttribute('src'));
