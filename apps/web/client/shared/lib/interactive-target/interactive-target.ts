import { INTERACTIVE_TARGET } from './interactive-target.constants';

export const isInteractiveTarget = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest(INTERACTIVE_TARGET.selector) !== null;
