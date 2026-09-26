'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { FormDialog } from '@/features/community/form-dialog';
import { buttonVariants, Select } from '@/ui-kit';

import { useCoachProfileForm } from '../../../model/hooks';
import { CoachAboutFields, CoachActiveField, CoachContactsFields, CoachTanksField } from './components';

export const CoachProfileDialog = () => {
  const t = useTranslations('coaching.profile');
  const { form, accounts, hasProfile, isOpen, isLoading, isPending, onOpenChange, onSubmit } = useCoachProfileForm();

  return (
    <FormDialog
      cancelLabel={t('cancel')}
      description={t('description')}
      form={form}
      isOpen={isOpen}
      isPending={isPending}
      isTriggerDisabled={isLoading}
      submitLabel={t('save')}
      title={hasProfile ? t('editTitle') : t('becomeTitle')}
      trigger={hasProfile ? t('edit') : t('become')}
      triggerClassName={buttonVariants({ size: 'sm', variant: hasProfile ? 'secondary' : 'primary' })}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
    >
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
      <CoachAboutFields />
      <CoachTanksField />
      <CoachContactsFields />
      <CoachActiveField />
    </FormDialog>
  );
};
