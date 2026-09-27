'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import type { PlayerLookupFormValues } from '../../../lib/player-lookup-form';
import type { UsePlayerLookupInput } from './use-player-lookup.types';

import { playerLookupFormSchema } from '../../../lib/player-lookup-form';
import { usePlayerSuggestions } from '../use-player-suggestions';

export const usePlayerLookup = ({ player, onPick }: UsePlayerLookupInput) => {
  const { control, register, setValue, handleSubmit } = useForm<PlayerLookupFormValues>({
    resolver: zodResolver(playerLookupFormSchema),
    defaultValues: { player }
  });

  const input = useWatch({ control, name: 'player' });
  const { players } = usePlayerSuggestions(input === player ? '' : input);

  const pick = (value: string) => {
    setValue('player', value);
    onPick(value.trim());
  };

  const onSubmit = handleSubmit((values) => pick(values.player));

  return { field: register('player'), players, canSubmit: input.trim().length > 0, pick, onSubmit };
};
