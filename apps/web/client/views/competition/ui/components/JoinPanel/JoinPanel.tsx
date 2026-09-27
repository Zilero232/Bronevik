'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { CommunityGate } from '@/entities/auth/session';
import { Button, Card, CardBody, CardHeader, FormField, Input, Select } from '@/ui-kit';

import type { JoinPanelProps } from './JoinPanel.types';

import { JOIN_FORM } from '../../../config';
import { useJoinCompetitionForm } from '../../../model/hooks';

import s from './JoinPanel.module.scss';

export const JoinPanel = ({ competition }: JoinPanelProps) => {
  const t = useTranslations('competitions.join');
  const id = useId();
  const { form, state, accountOptions, accountValue, teams, isNewTeam, myTeam, canLeave, isPending, onSubmit, onLeave } =
    useJoinCompetitionForm(competition);

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
                render={({ field }) => <Select items={accountOptions} label={t('account')} value={accountValue} onValueChange={field.onChange} />}
              />
              <Controller
                render={({ field }) => (
                  <Select
                    items={[
                      { value: JOIN_FORM.newTeam, label: t('newTeam') },
                      ...teams.map((team) => ({
                        value: team.id,
                        label: t('teamOption', { name: team.name, size: team.members.length, max: competition.maxTeamSize })
                      }))
                    ]}
                    label={t('team')}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
                control={form.control}
                name='teamId'
              />
              {isNewTeam && (
                <FormField error={form.formState.errors.teamName && t('teamNameError')} htmlFor={`${id}-team`} label={t('teamName')}>
                  <Input id={`${id}-team`} isInvalid={Boolean(form.formState.errors.teamName)} size='sm' {...form.register('teamName')} />
                </FormField>
              )}
              <Button disabled={isPending} size='sm' type='submit'>
                {t('submit')}
              </Button>
              <p className={s.hint}>{t('hint', { size: competition.maxTeamSize })}</p>
            </form>
          </CommunityGate>
        ) : (
          <>
            <p className={s.state} data-state={state}>
              {state === 'joined' ? t('state.joined', { team: myTeam ?? '' }) : t(`state.${state}`)}
            </p>
            {canLeave && (
              <Button disabled={isPending} size='sm' variant='secondary' onClick={onLeave}>
                {t('leave')}
              </Button>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};
