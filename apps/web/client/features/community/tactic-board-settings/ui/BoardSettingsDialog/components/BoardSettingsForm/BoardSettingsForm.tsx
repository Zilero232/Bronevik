'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { Button, buttonVariants, DialogClose, DialogFooter, FormField, Input, Select } from '@/ui-kit';

import type { BoardSettingsValues } from '../../../../lib/board-settings';
import type { BoardSettingsFormProps } from './BoardSettingsForm.types';

import { useBoardSettingsForm } from '../../../../model/hooks';

import s from './BoardSettingsForm.module.scss';

export const BoardSettingsForm = ({ defaultValues, submitLabel, onSubmit }: BoardSettingsFormProps) => {
  const t = useTranslations('tactics.settings');
  const {
    control,
    errors,
    isSubmitting,
    register,
    mapItems,
    modeItems,
    visibility,
    visibilityItems,
    onArenaChange,
    onSubmit: submit
  } = useBoardSettingsForm({ defaultValues, onSubmit });

  return (
    <form noValidate className={s.root} onSubmit={submit}>
      <FormField error={errors.title && t('titleError')} label={t('title')}>
        <Input isInvalid={Boolean(errors.title)} placeholder={t('titlePlaceholder')} {...register('title')} />
      </FormField>
      <div className={s.row}>
        <Controller
          control={control}
          name='arenaId'
          render={({ field }) => <Select items={mapItems} label={t('map')} value={field.value} onValueChange={onArenaChange} />}
        />
        <Controller
          control={control}
          name='mode'
          render={({ field }) => <Select items={modeItems} label={t('mode')} value={field.value} onValueChange={field.onChange} />}
        />
      </div>
      <Controller
        render={({ field }) => (
          <Select<BoardSettingsValues['visibility']>
            items={visibilityItems}
            label={t('visibility')}
            value={field.value}
            onValueChange={field.onChange}
          />
        )}
        control={control}
        name='visibility'
      />
      <p className={s.hint}>{t(`visibilityHint.${visibility}`)}</p>
      {errors.root?.server && <p className={s.error}>{t('serverError')}</p>}
      <DialogFooter>
        <DialogClose className={buttonVariants({ variant: 'ghost', size: 'sm' })}>{t('cancel')}</DialogClose>
        <Button disabled={isSubmitting} size='sm' type='submit'>
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
};
