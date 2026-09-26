'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller, FormProvider } from 'react-hook-form';

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
  Switch,
  Textarea,
  TierNumeral,
  ToggleChips
} from '@/ui-kit';

import { PLATOON_BOARD, PLATOON_FORM, PLATOON_MODES, PLATOON_TIERS } from '../../../config';
import { useCreatePlatoonForm } from '../../../model/hooks';
import { PlatoonTanksField } from './components';

import s from './CreatePlatoonDialog.module.scss';

export const CreatePlatoonDialog = () => {
  const t = useTranslations('platoons.create');
  const tModes = useTranslations('platoons.modes');
  const id = useId();
  const { form, isOpen, isPending, onOpenChange, onSubmit } = useCreatePlatoonForm();
  const { errors } = form.formState;

  return (
    <CommunityGate>
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
              <Controller
                control={form.control}
                name='accountId'
                render={({ field }) => <AccountSelect value={field.value} onChange={field.onChange} />}
              />
              <FormField label={t('tiers')}>
                <Controller
                  render={({ field }) => (
                    <ToggleChips
                      aria-label={t('tiers')}
                      options={PLATOON_TIERS.map((tier) => ({ value: tier, label: <TierNumeral tier={Number(tier)} /> }))}
                      size='sm'
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                  control={form.control}
                  name='tiers'
                />
              </FormField>
              <FormField label={t('modes')}>
                <Controller
                  render={({ field }) => (
                    <ToggleChips
                      aria-label={t('modes')}
                      options={PLATOON_MODES.map((mode) => ({ value: mode, label: tModes(mode) }))}
                      size='sm'
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                  control={form.control}
                  name='modes'
                />
              </FormField>
              <PlatoonTanksField />
              <div className={s.row}>
                <FormField error={errors.minWn8 && t('minWn8Error')} htmlFor={`${id}-wn8`} label={t('minWn8')}>
                  <Input
                    id={`${id}-wn8`}
                    inputMode='numeric'
                    isInvalid={Boolean(errors.minWn8)}
                    placeholder='0'
                    size='sm'
                    {...form.register('minWn8')}
                  />
                </FormField>
                <Controller
                  render={({ field }) => (
                    <Select
                      items={PLATOON_BOARD.expiresOptions.map((hours) => ({ value: String(hours), label: t('hours', { count: hours }) }))}
                      label={t('expiresIn')}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                  control={form.control}
                  name='expiresInHours'
                />
              </div>
              <div className={s.row}>
                <FormField htmlFor={`${id}-from`} label={t('availableFrom')}>
                  <Input id={`${id}-from`} size='sm' type='datetime-local' {...form.register('availableFrom')} />
                </FormField>
                <FormField error={errors.availableUntil && t('windowError')} htmlFor={`${id}-until`} label={t('availableUntil')}>
                  <Input
                    id={`${id}-until`}
                    isInvalid={Boolean(errors.availableUntil)}
                    size='sm'
                    type='datetime-local'
                    {...form.register('availableUntil')}
                  />
                </FormField>
              </div>
              <Controller
                control={form.control}
                name='hasVoice'
                render={({ field }) => <Switch checked={field.value} label={t('voice')} onCheckedChange={field.onChange} />}
              />
              <FormField error={errors.message && t('messageError')} htmlFor={`${id}-message`} label={t('message')}>
                <Textarea
                  id={`${id}-message`}
                  isInvalid={Boolean(errors.message)}
                  placeholder={t('messagePlaceholder')}
                  rows={PLATOON_FORM.messageRows}
                  {...form.register('message')}
                />
              </FormField>
              <p className={s.note}>{t('replaceNote')}</p>
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
