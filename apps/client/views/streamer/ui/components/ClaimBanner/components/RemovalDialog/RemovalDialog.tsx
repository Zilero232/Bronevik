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
  FormField,
  Input,
  Textarea
} from '@/ui-kit';

import type { RemovalDialogProps } from './RemovalDialog.types';

import { useRemovalForm } from '../../../../../model/hooks';

import s from './RemovalDialog.module.scss';

export const RemovalDialog = ({ open, onOpenChange }: RemovalDialogProps) => {
  const t = useTranslations('streamersDirectory.public.removal');
  const id = useId();
  const { register, errors, isSubmitting, onSubmit } = useRemovalForm(() => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <form noValidate className={s.form} onSubmit={onSubmit}>
          <FormField error={errors.contact && t('contactError')} hint={t('contactHint')} htmlFor={`${id}-contact`} label={t('contact')}>
            <Input autoComplete='email' id={`${id}-contact`} isInvalid={Boolean(errors.contact)} {...register('contact')} />
          </FormField>
          <FormField error={errors.reason && t('reasonError')} hint={t('reasonHint')} htmlFor={`${id}-reason`} label={t('reason')}>
            <Textarea id={`${id}-reason`} isInvalid={Boolean(errors.reason)} rows={4} {...register('reason')} />
          </FormField>
          <DialogFooter>
            <DialogClose className={buttonVariants({ variant: 'ghost' })}>{t('cancel')}</DialogClose>
            <Button disabled={isSubmitting} type='submit' variant='danger'>
              {t('submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
