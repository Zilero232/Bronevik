'use client';

import { CalendarPlus } from 'lucide-react';

import { FormDialog } from '@/features/community/form-dialog';

import type { CreateEventDialogProps } from './CreateEventDialog.types';

import { useCreateEventForm } from '../../../../../model/hooks';
import { EventFormFields } from '../../../EventFormFields';

export const CreateEventDialog = ({ clanId }: CreateEventDialogProps) => {
  const dialog = useCreateEventForm({ clanId });

  return (
    <FormDialog dialog={dialog} namespace='clanWorkspace.events.dialog' triggerIcon={CalendarPlus}>
      <EventFormFields />
    </FormDialog>
  );
};
