import type { KeyRoot } from './escape-close.types';

import { send } from '../../../../shared/api/protocol';
import { KEYS } from '../../../../shared/config';
import { reportOnce } from '../../../../shared/lib/page-diag';

export const isEscape = (event: Pick<KeyboardEvent, 'key' | 'keyCode'>): boolean => event.key === KEYS.escape || event.keyCode === KEYS.escapeCode;

export const bindEscapeClose = (root: KeyRoot): (() => void) => {
  const listener = (event: KeyboardEvent): void => {
    if (!isEscape(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    reportOnce({ kind: 'keydown', text: 'Esc reached the page' });
    send({ type: 'close' });
  };

  root.addEventListener('keydown', listener);

  return () => root.removeEventListener('keydown', listener);
};
