import type { PlaceholderEmailInput } from '../auth.types';

import { PLACEHOLDER_EMAIL } from '../auth.constants';

export const placeholderEmail = ({ provider, id }: PlaceholderEmailInput): string => `${provider}-${id}@${PLACEHOLDER_EMAIL.domain}`;

export const isPlaceholderEmail = (email: string): boolean => email.endsWith(`@${PLACEHOLDER_EMAIL.domain}`);
