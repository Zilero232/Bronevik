import type { InsensitiveEquals } from './like-pattern.types';

import { LIKE_PATTERN } from './like-pattern.constants';

export const escapeLike = (text: string): string => text.replace(LIKE_PATTERN.special, (char) => `${LIKE_PATTERN.escape}${char}`);

export const insensitiveEquals = (value: string): InsensitiveEquals => ({ equals: escapeLike(value), mode: 'insensitive' });
