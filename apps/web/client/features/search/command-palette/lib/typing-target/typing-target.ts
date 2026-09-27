import { COMMAND_PALETTE } from '../../config';

const TYPING_TAGS: readonly string[] = COMMAND_PALETTE.typingTags;

export const isTypingTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement && (target.isContentEditable || TYPING_TAGS.includes(target.tagName));
