import { Card, CardHeader, EmptyState } from '@/ui-kit';

import type { EventGroupProps } from './EventGroup.types';

import { EventRow } from './components';

import s from './EventGroup.module.scss';

export const EventGroup = ({ title, emptyTitle, entries }: EventGroupProps) => (
  <Card padding='none'>
    <CardHeader meta={entries.length} title={title} />
    {entries.length === 0 ? (
      <EmptyState isCompact title={emptyTitle} />
    ) : (
      <ul className={s.list}>
        {entries.map((entry) => (
          <EventRow key={entry.event.id} entry={entry} />
        ))}
      </ul>
    )}
  </Card>
);
