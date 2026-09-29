import { useTranslations } from 'use-intl';

import type { ErrorText } from './use-error-text.types';

import { toManagerError } from '../../api';

export const useErrorText = () => {
  const t = useTranslations('errors');
  const tHelp = useTranslations('errorHelp');

  return (error: unknown): ErrorText => {
    const { code } = toManagerError(error);

    return { code, title: t(code), hint: tHelp(code) };
  };
};
