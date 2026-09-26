import type { LOGIN } from '../../config/login.constants';

export type LoginErrorKey = 'unknown' | (typeof LOGIN.errors)[number];
