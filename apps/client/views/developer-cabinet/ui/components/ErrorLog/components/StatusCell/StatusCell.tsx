import { Badge } from '@/ui-kit';

import type { StatusCellProps } from './StatusCell.types';

import { ERROR_LOG } from '../../../../../config';

export const StatusCell = ({ status }: StatusCellProps) => (
  <Badge tone={status >= ERROR_LOG.serverErrorStatus ? 'danger' : 'warning'}>{status}</Badge>
);
