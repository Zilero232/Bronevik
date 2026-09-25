'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from '@siberiacancode/reactuse';
import { Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { useForm } from 'react-hook-form';

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

import { ACTIVATE_FORM_DEFAULTS, activateFormSchema } from '../../../lib/activate-form';
import { useActivateChallenge } from '../../../model/hooks';
import { FormField } from '../FormField';

import s from './ActivateDialog.module.scss';

export const ActivateDialog = ({ id }: ActivateDialogProps) => {
  const t = useTranslations('streamer.challenges.actions');
  const tConfirm = useTranslations('streamer.confirm');
  const activate = useActivateChallenge();
  const [isOpen, setOpen] = useBoolean(false);
  const donorId = useId();
  const form = useForm({ resolver: zodResolver(activateFormSchema), defaultValues: ACTIVATE_FORM_DEFAULTS });

  const onSubmit = form.handleSubmit(({ donorName }) =>
    activate.mutate({ id, donorName: donorName === '' ? undefined : donorName }, { onSuccess: () => setOpen(false) })
  );

  return (
    <Dialog open={isOpen} onOpenChange={(next) => setOpen(next)}>
      <DialogTrigger className={buttonVariants({ size: 'sm' })} disabled={activate.isPending}>
        <Play size={14} />
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
            <Button disabled={activate.isPending} size='sm' type='submit'>
              {t('activate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
