'use client';

import type { ChangeEvent, SubmitEvent } from 'react';

import { useState } from 'react';

import type { UsePlayerLookupInput } from './use-player-lookup.types';

import { usePlayerSuggestions } from '../use-player-suggestions';

export const usePlayerLookup = ({ player, onPick }: UsePlayerLookupInput) => {
  const [input, setInput] = useState(player);
  const { players } = usePlayerSuggestions(input === player ? '' : input);

  const pick = (value: string) => {
    setInput(value);
    onPick(value.trim());
  };

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    pick(input);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => setInput(event.target.value);

  return { input, players, canSubmit: input.trim().length > 0, pick, onSubmit, onChange };
};
