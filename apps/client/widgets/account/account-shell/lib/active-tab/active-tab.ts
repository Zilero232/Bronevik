import { ROUTES } from '@/shared/constants';

import type { IsActiveTabInput } from './active-tab.types';

export const isActiveTab = ({ href, pathname }: IsActiveTabInput): boolean => (href === ROUTES.me ? pathname === href : pathname.startsWith(href));
