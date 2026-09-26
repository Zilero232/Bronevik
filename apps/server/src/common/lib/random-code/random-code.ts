import { customAlphabet } from 'nanoid';

import type { RandomCodeInput } from './random-code.types';

export const randomCode = ({ alphabet, length }: RandomCodeInput): string => customAlphabet(alphabet, length)();
