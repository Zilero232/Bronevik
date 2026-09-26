import type { ErrorBody, ErrorBodyInput } from './error-body.types';

export const errorBody = ({ code, error }: ErrorBodyInput): ErrorBody => ({ error, code });
