'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { AccountSelect } from '@/entities/auth/session';
import { FormField, Input } from '@/ui-kit';
import { EntryPanel } from '@/widgets/community/entry-panel';

import type { RegistrationPanelProps } from './RegistrationPanel.types';

import { useRegistrationForm } from '../../../model/hooks';

export const RegistrationPanel = ({ tournament }: RegistrationPanelProps) => {
  const t = useTranslations('tournaments.registration');
  const id = useId();
  const { form, state, isPending, canWithdraw, onSubmit, onWithdraw } = useRegistrationForm(tournament);

  return (
    <EntryPanel
      exit={canWithdraw ? { label: t('withdraw'), onClick: onWithdraw } : null}
      hint={t('requirementsHint')}
      isDone={state === 'registered'}
      isOpen={state === 'open'}
      isPending={isPending}
      status={state === 'open' ? null : t(`state.${state}`)}
      submitLabel={t('submit')}
      title={t('title')}
      onSubmit={onSubmit}
    >
      <Controller control={form.control} name='accountId' render={({ field }) => <AccountSelect value={field.value} onChange={field.onChange} />} />
      <FormField error={form.formState.errors.teamName && t('teamNameError')} hint={t('teamNameHint')} htmlFor={`${id}-team`} label={t('teamName')}>
        <Input id={`${id}-team`} isInvalid={Boolean(form.formState.errors.teamName)} size='sm' {...form.register('teamName')} />
      </FormField>
    </EntryPanel>
  );
};
