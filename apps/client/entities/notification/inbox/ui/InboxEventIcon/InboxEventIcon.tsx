import { clsx } from 'clsx';

import type { InboxEventIconProps } from './InboxEventIcon.types';

import { INBOX_ENTRY, INBOX_EVENT } from '../../config';

import s from './InboxEventIcon.module.scss';

export const InboxEventIcon = ({ event, size = 'md', className }: InboxEventIconProps) => {
  const { icon: Icon, tone } = INBOX_EVENT[event];

  return (
    <span aria-hidden className={clsx(s.root, s[size], className)} data-tone={tone}>
      <Icon size={INBOX_ENTRY.iconSize[size]} strokeWidth={2} />
    </span>
  );
};
