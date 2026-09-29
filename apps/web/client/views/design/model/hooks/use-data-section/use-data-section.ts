'use client';

import { useState } from 'react';

import { NUMBER_SPECIMEN } from '../../../config';

export const useDataSection = () => {
  const [value, setValue] = useState<number>(NUMBER_SPECIMEN.initial);

  const shuffle = () => setValue(Math.round(NUMBER_SPECIMEN.min + Math.random() * NUMBER_SPECIMEN.span));

  return { value, shuffle };
};
