'use client';

import type { CreatedApiKey } from '@otmetki/schemas';

import { useState } from 'react';

import type { UseCreateKeyDialogInput } from './use-create-key-dialog.types';

export const useCreateKeyDialog = ({ onOpenChange }: UseCreateKeyDialogInput) => {
  const [created, setCreated] = useState<CreatedApiKey | null>(null);

  const onChange = (next: boolean) => {
    onOpenChange(next);

    if (!next) {
      setCreated(null);
    }
  };

  const onDone = () => onChange(false);

  return { created, setCreated, onChange, onDone };
};
