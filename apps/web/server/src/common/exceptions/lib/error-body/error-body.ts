import type { ErrorBody, ErrorBodyInput } from './error-body.types';

export const errorBody = ({ code, error, details }: ErrorBodyInput): ErrorBody => ({ error, code, ...(details ? { details } : {}) });
