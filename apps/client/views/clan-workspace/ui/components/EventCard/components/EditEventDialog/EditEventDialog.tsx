'use client';

import { Pencil } from 'lucide-react';

import { FormDialog } from '@/features/community/form-dialog';
import { buttonVariants } from '@/ui-kit';

import type { EditEventDialogProps } from './EditEventDialog.types';

import { useEditEventForm } from '../../../../../model/hooks';
import { EventFormFields } from '../../../EventFormFields';

export const EditEventDialog = ({ clanId, event }: EditEventDialogProps) => {
  const dialog = useEditEventForm({ clanId, event });

  return (
    <FormDialog
      dialog={dialog}
      namespace='clanWorkspace.events.editDialog'
      triggerClassName={buttonVariants({ variant: 'ghost', size: 'sm' })}
      triggerIcon={Pencil}
    >
      <EventFormFields />
    </FormDialog>
  );
};
