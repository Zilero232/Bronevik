import type { LoginErrorKey } from './login-error.types';

import { LOGIN } from '../../config/login.constants';

export const loginErrorKey = (error: string): LoginErrorKey => LOGIN.errors.find((code) => code === error) ?? 'unknown';
