'use client';

import type { FieldValues } from 'react-hook-form';

import { FormProvider } from 'react-hook-form';

import { CommunityGate } from '@/features/community/viewer';
import {
  Button,
  buttonVariants,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/ui-kit';

import type { FormDialogProps } from './FormDialog.types';

import s from './FormDialog.module.scss';

export const FormDialog = <TValues extends FieldValues, TOutput>({
  form,
  isOpen,
  isPending,
  canSubmit = true,
  requiresLesta,
  trigger,
  triggerClassName = buttonVariants({ size: 'sm' }),
  isTriggerDisabled,
  title,
  description,
  cancelLabel,
  submitLabel,
  children,
  onOpenChange,
  onSubmit
}: FormDialogProps<TValues, TOutput>) => (
  <CommunityGate requiresLesta={requiresLesta}>
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className={triggerClassName} disabled={isTriggerDisabled}>
        {trigger}
      </DialogTrigger>
      <DialogContent className={s.dialog}>
        <FormProvider {...form}>
          <form noValidate className={s.root} onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {children}
            <DialogFooter>
              <DialogClose className={buttonVariants({ variant: 'ghost', size: 'sm' })}>{cancelLabel}</DialogClose>
              <Button disabled={isPending || !canSubmit} size='sm' type='submit'>
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  </CommunityGate>
);
