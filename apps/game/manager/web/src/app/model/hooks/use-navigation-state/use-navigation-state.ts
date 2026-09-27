import { useState } from 'react';

import type { NavigationTarget, NavigationValue } from '@/shared/lib';

import { PAGES } from '@/shared/config';

export const useNavigationState = (): NavigationValue => {
  const [target, setTarget] = useState<NavigationTarget>({ page: PAGES.initial });

  return { page: target.page, params: target.params ?? {}, navigate: setTarget };
};
