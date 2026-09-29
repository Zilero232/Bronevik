'use client';

import { useState } from 'react';
import { sortBy } from 'remeda';

import { useGuessMap } from '../../context';

export const useMapChoices = () => {
  const { pool, guesses, submit } = useGuessMap();
  const [search, setSearch] = useState('');

  const needle = search.trim().toLocaleLowerCase();
  const guessed = new Set(guesses.map(({ map }) => map.arenaId));

  return {
    search,
    attempt: guesses.length + 1,
    choices: sortBy(
      pool.filter(({ arenaId, name }) => !guessed.has(arenaId) && name.toLocaleLowerCase().includes(needle)),
      ({ name }) => name
    ),
    onSearchChange: setSearch,
    onPick: submit
  };
};
