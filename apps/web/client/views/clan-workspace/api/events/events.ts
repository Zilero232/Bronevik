import {
  clanWorkspaceControllerCreateEvent,
  clanWorkspaceControllerListEvents,
  clanWorkspaceControllerRemoveEvent,
  clanWorkspaceControllerRsvp,
  clanWorkspaceControllerSetAttendance,
  clanWorkspaceControllerSyncAttendance,
  clanWorkspaceControllerUpdateEvent
} from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { CreateEventInput, EventScope, ListEventsInput, RsvpInput, SetAttendanceInput, UpdateEventInput, WorkspaceEvent } from './events.types';

export const listWorkspaceEvents = ({ clanId, from, to, signal }: ListEventsInput): Promise<WorkspaceEvent[]> =>
  fromSdk(() => clanWorkspaceControllerListEvents({ ...SESSION_REQUEST, path: { clanId }, query: { from, to }, signal }));

export const createWorkspaceEvent = ({ clanId, event }: CreateEventInput): Promise<WorkspaceEvent> =>
  fromSdk(() => clanWorkspaceControllerCreateEvent({ ...SESSION_REQUEST, path: { clanId }, body: event }));

export const updateWorkspaceEvent = ({ clanId, id, event }: UpdateEventInput): Promise<WorkspaceEvent> =>
  fromSdk(() => clanWorkspaceControllerUpdateEvent({ ...SESSION_REQUEST, path: { clanId, id }, body: event }));

export const removeWorkspaceEvent = async ({ clanId, id }: EventScope): Promise<void> => {
  await fromSdk(() => clanWorkspaceControllerRemoveEvent({ ...SESSION_REQUEST, path: { clanId, id } }));
};

export const setEventAttendance = ({ clanId, id, entries }: SetAttendanceInput): Promise<WorkspaceEvent> =>
  fromSdk(() => clanWorkspaceControllerSetAttendance({ ...SESSION_REQUEST, path: { clanId, id }, body: { entries } }));

export const syncEventAttendance = ({ clanId, id }: EventScope): Promise<WorkspaceEvent> =>
  fromSdk(() => clanWorkspaceControllerSyncAttendance({ ...SESSION_REQUEST, path: { clanId, id } }));

export const rsvpEvent = ({ clanId, id, status }: RsvpInput): Promise<WorkspaceEvent> =>
  fromSdk(() => clanWorkspaceControllerRsvp({ ...SESSION_REQUEST, path: { clanId, id }, body: { status } }));
