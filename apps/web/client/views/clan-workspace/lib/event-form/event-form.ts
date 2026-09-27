import { isoToZonedInput, zonedInputToIso } from '@/shared/lib';

import type { NewWorkspaceEvent, WorkspaceEvent } from '../../api';
import type { EventFormFields, EventFormValues } from './event-form.types';

import { EVENT_FORM_DEFAULTS, REMIND_OPTIONS } from '../../config';

export const toNewWorkspaceEvent = (values: EventFormFields): NewWorkspaceEvent => {
  const endsAt = zonedInputToIso({ value: values.endsAt });

  return {
    kind: values.kind,
    title: values.title.trim(),
    startsAt: zonedInputToIso({ value: values.startsAt }) ?? '',
    ...(endsAt === undefined ? {} : { endsAt }),
    remindMinutesBefore: Number(values.remind)
  };
};

export const toEventFormValues = (event: WorkspaceEvent): EventFormValues => ({
  title: event.title,
  kind: event.kind,
  startsAt: isoToZonedInput({ value: event.startsAt }),
  endsAt: isoToZonedInput({ value: event.endsAt }),
  remind: REMIND_OPTIONS.find((minutes) => Number(minutes) === event.remindMinutesBefore) ?? EVENT_FORM_DEFAULTS.remind
});
