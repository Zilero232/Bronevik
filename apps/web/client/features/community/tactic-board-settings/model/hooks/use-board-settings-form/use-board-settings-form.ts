'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';

import type { SelectItem } from '@/ui-kit';

import type { BoardSettingsValues } from '../../../lib/board-settings';
import type { UseBoardSettingsFormInput } from './use-board-settings-form.types';

import { BOARD_SETTINGS, TACTIC_VISIBILITIES } from '../../../config';
import { boardModeOptions, boardSettingsSchema, toBoardSettingsPayload } from '../../../lib/board-settings';
import { useTacticMaps } from '../use-tactic-maps';

export const useBoardSettingsForm = ({ defaultValues, onSubmit }: UseBoardSettingsFormInput) => {
  const t = useTranslations('tactics.visibility');
  const { maps, mapItems, modeItems } = useTacticMaps();
  const {
    control,
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    register,
    setError,
    setValue
  } = useForm<BoardSettingsValues>({ resolver: zodResolver(boardSettingsSchema), defaultValues, mode: 'onTouched' });

  const [arenaId, visibility] = useWatch({ control, name: ['arenaId', 'visibility'] });
  const visibilityItems: SelectItem<BoardSettingsValues['visibility']>[] = TACTIC_VISIBILITIES.map((value) => ({ value, label: t(value) }));

  const onArenaChange = (next: string) => {
    setValue('arenaId', next);

    const mode = getValues('mode');

    if (mode !== BOARD_SETTINGS.none && !boardModeOptions({ maps, arenaId: next }).includes(mode)) {
      setValue('mode', BOARD_SETTINGS.none);
    }
  };

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(toBoardSettingsPayload(values));
    } catch {
      setError('root.server', { message: 'server' });
    }
  });

  return {
    control,
    errors,
    isSubmitting,
    register,
    mapItems,
    modeItems: modeItems(arenaId),
    visibility,
    visibilityItems,
    onArenaChange,
    onSubmit: submit
  };
};
