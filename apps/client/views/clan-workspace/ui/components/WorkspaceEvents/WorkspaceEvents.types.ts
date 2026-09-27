import type { EventCardProps } from '../EventCard/EventCard.types';

export type WorkspaceEventsProps = Pick<EventCardProps, 'clanId' | 'isOfficer' | 'members'>;
