import type { ComponentProps } from 'react';

import { createNavigation } from 'next-intl/navigation';

import { routing } from '../routing';
import { PAGE_TRANSITION } from './navigation.constants';

const navigation = createNavigation(routing);

export const { usePathname, useRouter } = navigation;

export const Link = ({ transitionTypes = [PAGE_TRANSITION.type], ...props }: ComponentProps<typeof navigation.Link>) => (
  <navigation.Link transitionTypes={transitionTypes} {...props} />
);
