import { BULL_BOARD } from '../../../config';
import { OPENAPI } from '../../../openapi';

export const API_HELMET = {
  crossOriginResourcePolicy: { policy: 'same-site' },
  documentationPaths: [`/${OPENAPI.internal.path}`, `/${OPENAPI.public.path}`, BULL_BOARD.route]
} as const;
