'use client';

import { useCopy } from '@siberiacancode/reactuse';

import type { UseCopyFeedbackInput } from './use-copy-feedback.types';

export const useCopyFeedback = ({ value, onCopy }: UseCopyFeedbackInput) => {
  const { copied, copy } = useCopy();

  const onCopyClick = async () => {
    await copy(value);
    onCopy?.();
  };

  return { copied, onCopyClick };
};
