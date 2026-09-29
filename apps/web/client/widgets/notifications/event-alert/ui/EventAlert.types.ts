import type { ReactNode } from 'react';

import type { UseEventAlertInput } from '../model/hooks';

export type EventAlertProps = UseEventAlertInput & {
  label: string;
  channels: string;
  skeleton: { width: number; height: number };
  signedOut?: ReactNode;
};
