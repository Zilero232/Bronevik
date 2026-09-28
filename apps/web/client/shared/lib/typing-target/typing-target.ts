import { TYPING_TARGET } from './typing-target.constants';

const TAGS: readonly string[] = TYPING_TARGET.tags;

export const isTypingTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement && (target.isContentEditable || TAGS.includes(target.tagName));
