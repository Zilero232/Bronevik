import type { EventCellProps } from './EventCell.types';

import s from './EventCell.module.scss';

export const EventCell = ({ event }: EventCellProps) => <code className={s.root}>{event}</code>;
