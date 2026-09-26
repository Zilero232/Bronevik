'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { AccountSelect, CommunityGate } from '@/features/community/viewer';
import { Button, Card, CardBody, CardHeader, FormField, Input } from '@/ui-kit';

import type { RegistrationPanelProps } from './RegistrationPanel.types';

import { useRegistrationForm } from '../../../model/hooks';

import s from './RegistrationPanel.module.scss';

export const RegistrationPanel = ({ tournament }: RegistrationPanelProps) => {
  const t = useTranslations('tournaments.registration');
  const id = useId();
  const { form, state, isPending, onSubmit } = useRegistrationForm(tournament);

  return (
    <Card padding='none'>
      <CardHeader title={t('title')} />
      <CardBody className={s.body}>
        {state === 'open' ? (
          <CommunityGate>
            <form noValidate className={s.form} onSubmit={onSubmit}>
              <Controller
                control={form.control}
                name='accountId'
                render={({ field }) => <AccountSelect value={field.value} onChange={field.onChange} />}
              />
              <FormField
                error={form.formState.errors.teamName && t('teamNameError')}
                hint={t('teamNameHint')}
                htmlFor={`${id}-team`}
                label={t('teamName')}
              >
                <Input id={`${id}-team`} isInvalid={Boolean(form.formState.errors.teamName)} size='sm' {...form.register('teamName')} />
              </FormField>
              <Button disabled={isPending} size='sm' type='submit'>
                {t('submit')}
              </Button>
              <p className={s.hint}>{t('requirementsHint')}</p>
            </form>
          </CommunityGate>
        ) : (
          <p className={s.state} data-state={state}>
            {t(`state.${state}`)}
          </p>
        )}
      </CardBody>
    </Card>
  );
};
