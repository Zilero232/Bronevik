import { BUTTON } from '../button.constants';
import { findButtonModel } from '../find-model';

export const openWindow = (): void => {
  const model = findButtonModel(globalThis);
  const command = model?.[BUTTON.openCommand];

  if (typeof command === 'function') {
    Reflect.apply(command, model, [{}]);

    return;
  }

  console.warn('[OTMETKI] hangar button: no model to open the window');
};
