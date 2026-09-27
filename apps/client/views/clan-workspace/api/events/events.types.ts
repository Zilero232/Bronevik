import type {
  ClanEvent,
  ClanWorkspaceControllerListEventsData,
  ClanWorkspaceControllerRemoveEventData,
  CreateClanEvent,
  Rsvp,
  SetAttendance,
  UpdateClanEvent
} from '@/shared/api/generated';

export type WorkspaceEvent = ClanEvent;

export type WorkspaceEventKind = ClanEvent['kind'];

export type AttendanceEntry = ClanEvent['attendance'][number];

export type AttendanceStatus = AttendanceEntry['status'];

export type RsvpStatus = Rsvp['status'];

export type NewWorkspaceEvent = CreateClanEvent;

export type EventScope = ClanWorkspaceControllerRemoveEventData['path'];

export type ListEventsInput = ClanWorkspaceControllerListEventsData['path'] &
  NonNullable<ClanWorkspaceControllerListEventsData['query']> & {
    signal?: AbortSignal;
  };

export type CreateEventInput = ClanWorkspaceControllerListEventsData['path'] & {
  event: NewWorkspaceEvent;
};

export type UpdateEventInput = EventScope & {
  event: UpdateClanEvent;
};

export type SetAttendanceInput = EventScope & SetAttendance;

export type RsvpInput = EventScope & Rsvp;
