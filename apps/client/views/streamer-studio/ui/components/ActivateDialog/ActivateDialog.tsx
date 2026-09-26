'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

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
  DialogTrigger,
  Input
} from '@/ui-kit';

import type { ActivateDialogProps } from './ActivateDialog.types';

import { useActivateForm } from '../../../model/hooks';
import { FormField } from '../FormField';

import s from './ActivateDialog.module.scss';

export const ActivateDialog = ({ id }: ActivateDialogProps) => {
  const t = useTranslations('streamer.challenges.actions');
  const tConfirm = useTranslations('streamer.confirm');
  const donorId = useId();
  const { form, isOpen, isPending, onOpenChange, onSubmit } = useActivateForm(id);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className={buttonVariants({ size: 'sm' })} disabled={isPending}>
        {t('activate')}
      </DialogTrigger>
      <DialogContent>
        <form noValidate className={s.root} onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{t('activateTitle')}</DialogTitle>
            <DialogDescription>{t('activateDescription')}</DialogDescription>
          </DialogHeader>
          <FormField error={form.formState.errors.donorName && t('donorError')} htmlFor={donorId} label={t('donorName')}>
            <Input id={donorId} placeholder={t('donorPlaceholder')} {...form.register('donorName')} />
          </FormField>
          <DialogFooter>
            <DialogClose className={buttonVariants({ variant: 'ghost', size: 'sm' })}>{tConfirm('cancel')}</DialogClose>
            <Button disabled={isPending} size='sm' type='submit'>
              {t('activate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
