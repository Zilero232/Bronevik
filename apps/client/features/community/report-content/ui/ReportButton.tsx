'use client';

import { Flag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
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
  FormField,
  Select,
  Textarea
} from '@/ui-kit';

import type { ReportButtonProps } from './ReportButton.types';

import { useReportForm } from '../model/hooks';

import s from './ReportButton.module.scss';

export const ReportButton = ({ targetType, targetId, className }: ReportButtonProps) => {
  const t = useTranslations('community.report');
  const { form, isSignedIn, isOpen, isPending, reasons, detailsLength, detailsMaxLength, onOpenChange, onSubmit } = useReportForm({
    targetType,
    targetId
  });

  if (!isSignedIn) {
    return (
      <Link className={buttonVariants({ variant: 'ghost', size: 'sm', className })} href={ROUTES.login} title={t('signIn')}>
        <Flag size={14} />
        {t('trigger')}
      </Link>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className={buttonVariants({ variant: 'ghost', size: 'sm', className })}>
        <Flag size={14} />
        {t('trigger')}
      </DialogTrigger>
      <DialogContent>
        <form noValidate className={s.root} onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>
          <Controller
            control={form.control}
            name='reason'
            render={({ field }) => <Select items={reasons} label={t('reason')} value={field.value} onValueChange={field.onChange} />}
          />
          <FormField
            error={form.formState.errors.details && t('detailsError')}
            hint={t('detailsHint', { length: detailsLength, max: detailsMaxLength ?? detailsLength })}
            htmlFor={`report-details-${targetId}`}
            label={t('details')}
          >
            <Textarea
              id={`report-details-${targetId}`}
              isInvalid={Boolean(form.formState.errors.details)}
              maxLength={detailsMaxLength}
              placeholder={t('detailsPlaceholder')}
              rows={3}
              {...form.register('details')}
            />
          </FormField>
          <DialogFooter>
            <DialogClose className={buttonVariants({ variant: 'ghost', size: 'sm' })}>{t('cancel')}</DialogClose>
            <Button disabled={isPending} size='sm' type='submit'>
              {t('submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
