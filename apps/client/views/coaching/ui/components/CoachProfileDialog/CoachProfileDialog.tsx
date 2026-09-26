'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller, FormProvider } from 'react-hook-form';

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
  Select,
  Switch,
  Textarea
} from '@/ui-kit';

import { COACH_FORM } from '../../../config';
import { useCoachProfileForm } from '../../../model/hooks';
import { CoachTanksField } from './components';

import s from './CoachProfileDialog.module.scss';

export const CoachProfileDialog = () => {
  const t = useTranslations('coaching.profile');
  const id = useId();
  const { form, accounts, hasProfile, isOpen, isLoading, isPending, onOpenChange, onSubmit } = useCoachProfileForm();
  const { errors } = form.formState;

  return (
    <CommunityGate>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger className={buttonVariants({ size: 'sm', variant: hasProfile ? 'secondary' : 'primary' })} disabled={isLoading}>
          {hasProfile ? t('edit') : t('become')}
        </DialogTrigger>
        <DialogContent className={s.dialog}>
          <FormProvider {...form}>
            <form noValidate className={s.root} onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>{hasProfile ? t('editTitle') : t('becomeTitle')}</DialogTitle>
                <DialogDescription>{t('description')}</DialogDescription>
              </DialogHeader>
              <Controller
                render={({ field }) => (
                  <Select
                    items={accounts.map(({ accountId, nickname }) => ({ value: String(accountId), label: nickname }))}
                    label={t('account')}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
                control={form.control}
                name='accountId'
              />
              <FormField error={errors.headline && t('headlineError')} htmlFor={`${id}-headline`} label={t('headline')}>
                <Input
                  id={`${id}-headline`}
                  isInvalid={Boolean(errors.headline)}
                  placeholder={t('headlinePlaceholder')}
                  {...form.register('headline')}
                />
              </FormField>
              <FormField error={errors.bio && t('bioError')} htmlFor={`${id}-bio`} label={t('bio')}>
                <Textarea
                  id={`${id}-bio`}
                  isInvalid={Boolean(errors.bio)}
                  placeholder={t('bioPlaceholder')}
                  rows={COACH_FORM.bioRows}
                  {...form.register('bio')}
                />
              </FormField>
              <CoachTanksField />
              <fieldset className={s.contacts}>
                <legend className={s.legend}>{t('contacts')}</legend>
                <FormField error={errors.contacts?.telegram && t('linkError')} htmlFor={`${id}-tg`} label='Telegram'>
                  <Input
                    id={`${id}-tg`}
                    isInvalid={Boolean(errors.contacts?.telegram)}
                    placeholder='https://t.me/…'
                    size='sm'
                    {...form.register('contacts.telegram')}
                  />
                </FormField>
                <FormField error={errors.contacts?.vk && t('linkError')} htmlFor={`${id}-vk`} label={t('vk')}>
                  <Input
                    id={`${id}-vk`}
                    isInvalid={Boolean(errors.contacts?.vk)}
                    placeholder='https://vk.com/…'
                    size='sm'
                    {...form.register('contacts.vk')}
                  />
                </FormField>
                <FormField error={errors.contacts?.discord && t('discordError')} htmlFor={`${id}-discord`} label='Discord'>
                  <Input id={`${id}-discord`} isInvalid={Boolean(errors.contacts?.discord)} size='sm' {...form.register('contacts.discord')} />
                </FormField>
                <FormField error={errors.contacts?.booking && t('linkError')} hint={t('bookingHint')} htmlFor={`${id}-booking`} label={t('booking')}>
                  <Input
                    id={`${id}-booking`}
                    isInvalid={Boolean(errors.contacts?.booking)}
                    placeholder='https://'
                    size='sm'
                    {...form.register('contacts.booking')}
                  />
                </FormField>
              </fieldset>
              <Controller
                render={({ field }) => (
                  <Switch checked={field.value} description={t('activeHint')} label={t('active')} onCheckedChange={field.onChange} />
                )}
                control={form.control}
                name='isActive'
              />
              <DialogFooter>
                <DialogClose className={buttonVariants({ variant: 'ghost', size: 'sm' })}>{t('cancel')}</DialogClose>
                <Button disabled={isPending} size='sm' type='submit'>
                  {t('save')}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </CommunityGate>
  );
};
