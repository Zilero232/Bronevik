import type { HTMLAttributes } from 'react';

import type { RowActivationInput } from './row-activation.types';

import { isInteractiveTarget } from '../interactive-target';
import { ROW_ACTIVATION } from './row-activation.constants';

const ACTIVATION_KEYS = new Set<string>(ROW_ACTIVATION.keys);

export const rowActivation = ({ onActivate, isLinked }: RowActivationInput): HTMLAttributes<HTMLTableRowElement> =>
  onActivate
    ? {
        onClick: (event) => !isInteractiveTarget(event.target) && onActivate(),
        ...(isLinked
          ? {}
          : {
              tabIndex: 0,
              onKeyDown: (event) => {
                if (event.target === event.currentTarget && ACTIVATION_KEYS.has(event.key)) {
                  event.preventDefault();
                  onActivate();
                }
              }
            })
      }
    : {};
