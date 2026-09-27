import type { CHAT_COMMANDS } from '../../config';

export type ChatCommand = (typeof CHAT_COMMANDS)[number];
