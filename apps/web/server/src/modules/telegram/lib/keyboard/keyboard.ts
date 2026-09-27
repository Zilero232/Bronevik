import { InlineKeyboard } from 'grammy';

import type { OpenButtonInput } from './keyboard.types';

import { isPublicUrl } from '../../../bot-commands';

export const openButton = ({ label, url }: OpenButtonInput): InlineKeyboard | undefined =>
  isPublicUrl(url) ? new InlineKeyboard().url(label, url) : undefined;
