'use client';

import { useReturnPath } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';

export const useLoginReturn = () => {
  const returnPath = useReturnPath();

  return { returnPath, errorPath: ROUTES.auth.loginNext(returnPath) };
};
