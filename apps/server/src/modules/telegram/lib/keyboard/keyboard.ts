import { InlineKeyboard } from 'grammy';

import type { OpenButtonInput } from './keyboard.types';

import { isPublicUrl } from '../site-url';

export const openButton = ({ label, url }: OpenButtonInput): InlineKeyboard | undefined =>
  isPublicUrl(url) ? new InlineKeyboard().url(label, url) : undefined;
