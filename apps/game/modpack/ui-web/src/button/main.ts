import { BUTTON } from './button.constants';
import { findButtonModel } from './find-model';

const open = (): void => {
  const model = findButtonModel(globalThis);
  const command = model?.[BUTTON.openCommand];

  if (typeof command === 'function') {
    Reflect.apply(command, model, [{}]);

    return;
  }

  console.warn('[OTMETKI] hangar button: no model to open the window');
};

const mount = (): void => {
  if (document.getElementById(BUTTON.id)) {
    return;
  }

  const button = document.createElement('div');

  button.id = BUTTON.id;
  button.className = 'otmetki-button';
  button.title = BUTTON.title;
  button.textContent = BUTTON.label;
  button.addEventListener('click', open);
  document.body.appendChild(button);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
