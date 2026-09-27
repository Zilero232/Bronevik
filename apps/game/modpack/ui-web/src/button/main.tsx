import { render } from 'preact';

import { BUTTON } from './button.constants';
import { openWindow } from './open-window';
import { HangarButton } from './ui/hangar-button';

const mount = (): void => {
  if (document.getElementById(BUTTON.id)) {
    return;
  }

  const host = document.createElement('div');

  host.id = BUTTON.id;
  document.body.appendChild(host);
  render(<HangarButton onOpen={openWindow} />, host);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
