import type { ReactNode } from 'react';

import type { ProfileContextValue } from '../../../model/context';

export type ProfileProviderProps = Pick<ProfileContextValue, 'profile'> & {
  children: ReactNode;
};
