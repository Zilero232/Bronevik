import type { NameDialogProps } from './NameDialog.types';

import { Button, TextInput } from '../../atoms';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../Dialog';
import { FormField } from '../FormField';

import s from './NameDialog.module.scss';

export const NameDialog = ({ open, title, label, submitLabel, field, error, isPending, onOpenChange, onSubmit }: NameDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <form className={s.form} onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <FormField error={error} label={label}>
          {(control) => <TextInput {...control} {...field} autoComplete='off' />}
        </FormField>
        <DialogFooter>
          <Button isPending={isPending} type='submit'>
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);
