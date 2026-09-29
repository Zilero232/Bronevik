'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { FormField, Input, Select } from '@/ui-kit';
import { EntryPanel } from '@/widgets/community/entry-panel';

import type { JoinPanelProps } from './JoinPanel.types';

import { JOIN_FORM } from '../../../config';
import { useJoinCompetitionForm } from '../../../model/hooks';

export const JoinPanel = ({ competition }: JoinPanelProps) => {
  const t = useTranslations('competitions.join');
  const id = useId();
  const { form, state, accountOptions, accountValue, teams, isNewTeam, myTeam, canLeave, isPending, onSubmit, onLeave } =
    useJoinCompetitionForm(competition);

  return (
    <EntryPanel
      exit={canLeave ? { label: t('leave'), onClick: onLeave } : null}
      hint={t('hint', { size: competition.maxTeamSize })}
      isDone={state === 'joined'}
      isOpen={state === 'open'}
      isPending={isPending}
      status={state === 'open' ? null : state === 'joined' ? t('state.joined', { team: myTeam ?? '' }) : t(`state.${state}`)}
      submitLabel={t('submit')}
      title={t('title')}
      onSubmit={onSubmit}
    >
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
    </EntryPanel>
  );
};
