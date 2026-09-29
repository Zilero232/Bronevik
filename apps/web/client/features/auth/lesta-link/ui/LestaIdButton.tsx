'use client';

import { Suspense } from 'react';

import type { LestaIdButtonProps } from './LestaIdButton.types';

import { useLestaStartUrl } from '../model/hooks';
import { LestaIdAction, LestaIdLink } from './components';

export const LestaIdButton = ({ callbackPath, errorPath, ...link }: LestaIdButtonProps) => {
  const href = useLestaStartUrl({ callbackPath, errorPath });

  return (
    <Suspense fallback={<LestaIdLink {...link} />}>
      <LestaIdAction {...link} href={href} />
    </Suspense>
  );
};
