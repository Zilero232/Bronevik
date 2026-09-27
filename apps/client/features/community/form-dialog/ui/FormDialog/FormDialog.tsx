'use client';

import type { FieldValues } from 'react-hook-form';

import { useTranslations } from 'next-intl';
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

export const FormDialog = <TValues extends FieldValues, TOutput extends FieldValues>({
  dialog: { form, isOpen, isPending, onOpenChange, onSubmit },
  namespace,
  triggerIcon: TriggerIcon,
  canSubmit = true,
  requiresLesta,
  triggerClassName = buttonVariants({ size: 'sm' }),
  isTriggerDisabled,
  children
}: FormDialogProps<TValues, TOutput>) => {
  const t = useTranslations(namespace);

  return (
    <CommunityGate requiresLesta={requiresLesta}>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger className={triggerClassName} disabled={isTriggerDisabled}>
          {TriggerIcon && <TriggerIcon size={14} />}
          {t('open')}
        </DialogTrigger>
        <DialogContent className={s.dialog}>
          <FormProvider {...form}>
            <form noValidate className={s.root} onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>{t('title')}</DialogTitle>
                <DialogDescription>{t('description')}</DialogDescription>
              </DialogHeader>
              {children}
              <DialogFooter>
                <DialogClose className={buttonVariants({ variant: 'ghost', size: 'sm' })}>{t('cancel')}</DialogClose>
                <Button disabled={isPending || !canSubmit} size='sm' type='submit'>
                  {t('submit')}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </CommunityGate>
  );
};
