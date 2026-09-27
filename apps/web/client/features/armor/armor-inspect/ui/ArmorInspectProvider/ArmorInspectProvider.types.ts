import type { ReactNode } from 'react';

import type { ArmorInspectContextValue } from '../../model/context';

export type ArmorInspectProviderProps = Pick<ArmorInspectContextValue, 'modules'> & {
  children: ReactNode;
};
