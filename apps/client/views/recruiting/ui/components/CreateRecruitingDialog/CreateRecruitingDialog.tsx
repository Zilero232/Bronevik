'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller, FormProvider } from 'react-hook-form';

import { RequirementsFields } from '@/features/community/stat-requirements';
import { AccountSelect, CommunityGate } from '@/features/community/viewer';
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
  Select,
  Textarea
} from '@/ui-kit';

import type { CreateRecruitingDialogProps } from './CreateRecruitingDialog.types';

import { RECRUITING_BOARD } from '../../../config';
import { useCreateRecruitingForm } from '../../../model/hooks';

import s from './CreateRecruitingDialog.module.scss';

export const CreateRecruitingDialog = ({ kind }: CreateRecruitingDialogProps) => {
  const t = useTranslations('recruiting.create');
  const id = useId();
  const { form, isClan, isOpen, officers, canSubmit, isClansPending, isPending, onOpenChange, onSubmit } = useCreateRecruitingForm(kind);
  const { errors } = form.formState;

  return (
    <CommunityGate>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger className={buttonVariants({ size: 'sm' })}>
          <Plus size={14} />
          {t(`open.${kind}`)}
        </DialogTrigger>
        <DialogContent className={s.dialog}>
          <FormProvider {...form}>
            <form noValidate className={s.root} onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>{t(`title.${kind}`)}</DialogTitle>
                <DialogDescription>{t(`description.${kind}`)}</DialogDescription>
              </DialogHeader>
              {isClan && officers.length === 0 && <p className={s.warning}>{isClansPending ? t('checkingClan') : t('notOfficer')}</p>}
              {isClan && officers.length > 0 && (
                <Controller
                  render={({ field }) => (
                    <Select
                      items={officers.map((officer) => ({ value: String(officer.accountId), label: `[${officer.clanTag}] ${officer.nickname}` }))}
                      label={t('clan')}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                  control={form.control}
                  name='accountId'
                />
              )}
              {!isClan && (
                <Controller
                  control={form.control}
                  name='accountId'
                  render={({ field }) => <AccountSelect value={field.value} onChange={field.onChange} />}
                />
              )}
              <FormField error={errors.title && t('titleError')} htmlFor={`${id}-title`} label={t('postTitle')}>
                <Input id={`${id}-title`} isInvalid={Boolean(errors.title)} placeholder={t(`titlePlaceholder.${kind}`)} {...form.register('title')} />
              </FormField>
              <FormField error={errors.body && t('bodyError')} htmlFor={`${id}-body`} label={t('body')}>
                <Textarea
                  id={`${id}-body`}
                  isInvalid={Boolean(errors.body)}
                  placeholder={t(`bodyPlaceholder.${kind}`)}
                  rows={RECRUITING_BOARD.bodyRows}
                  {...form.register('body')}
                />
              </FormField>
              {isClan && <RequirementsFields />}
              <Controller
                render={({ field }) => (
                  <Select
                    items={RECRUITING_BOARD.expiresOptions.map((days) => ({ value: String(days), label: t('days', { count: days }) }))}
                    label={t('expiresIn')}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
                control={form.control}
                name='expiresInDays'
              />
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
