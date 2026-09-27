import type { InboxEntryProps } from '../../InboxEntry.types';

export type InboxEntryContentProps = Pick<InboxEntryProps, 'item'> & Required<Pick<InboxEntryProps, 'density'>>;
