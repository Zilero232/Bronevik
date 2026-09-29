import type { ReactNode } from 'react';

import type { UseGuessCellInput } from '../../../model/hooks';

export type GuessCellProps = UseGuessCellInput & {
  children: ReactNode;
};
