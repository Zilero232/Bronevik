'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { FormProvider } from 'react-hook-form';

import { RequirementsFields } from '@/features/community/stat-requirements';
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
  DialogTrigger,
  FormField,
  Input,
  Textarea
} from '@/ui-kit';

import { TOURNAMENT_LIST } from '../../../config';
import { useCreateTournamentForm } from '../../../model/hooks';

import s from './CreateTournamentDialog.module.scss';

export const CreateTournamentDialog = () => {
  const t = useTranslations('tournaments.create');
  const id = useId();
  const { form, isOpen, isPending, onOpenChange, onSubmit } = useCreateTournamentForm();
  const { errors } = form.formState;

  return (
    <CommunityGate requiresLesta={false}>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger className={buttonVariants({ size: 'sm' })}>
          <Plus size={14} />
          {t('open')}
        </DialogTrigger>
        <DialogContent className={s.dialog}>
          <FormProvider {...form}>
            <form noValidate className={s.root} onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>{t('title')}</DialogTitle>
                <DialogDescription>{t('description')}</DialogDescription>
              </DialogHeader>
              <FormField error={errors.title && t('titleError')} htmlFor={`${id}-title`} label={t('name')}>
                <Input id={`${id}-title`} isInvalid={Boolean(errors.title)} {...form.register('title')} />
              </FormField>
              <FormField error={errors.description && t('descriptionError')} htmlFor={`${id}-description`} label={t('about')}>
                <Textarea
                  id={`${id}-description`}
                  isInvalid={Boolean(errors.description)}
                  placeholder={t('aboutPlaceholder')}
                  rows={TOURNAMENT_LIST.descriptionRows}
                  {...form.register('description')}
                />
              </FormField>
              <div className={s.row}>
                <FormField error={errors.startsAt && t('startsAtError')} htmlFor={`${id}-starts`} label={t('startsAt')}>
                  <Input id={`${id}-starts`} isInvalid={Boolean(errors.startsAt)} size='sm' type='datetime-local' {...form.register('startsAt')} />
                </FormField>
                <FormField error={errors.registrationEndsAt && t('registrationEndsAtError')} htmlFor={`${id}-reg`} label={t('registrationEndsAt')}>
                  <Input
                    id={`${id}-reg`}
                    isInvalid={Boolean(errors.registrationEndsAt)}
                    size='sm'
                    type='datetime-local'
                    {...form.register('registrationEndsAt')}
                  />
                </FormField>
                <FormField error={errors.maxParticipants && t('maxParticipantsError')} htmlFor={`${id}-max`} label={t('maxParticipants')}>
                  <Input
                    id={`${id}-max`}
                    inputMode='numeric'
                    isInvalid={Boolean(errors.maxParticipants)}
                    size='sm'
                    {...form.register('maxParticipants')}
                  />
                </FormField>
              </div>
              <RequirementsFields />
              <p className={s.note}>{t('note')}</p>
              <DialogFooter>
                <DialogClose className={buttonVariants({ variant: 'ghost', size: 'sm' })}>{t('cancel')}</DialogClose>
                <Button disabled={isPending} size='sm' type='submit'>
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
