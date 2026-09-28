import { MutationCache } from '@tanstack/react-query';
import { createTranslator } from 'next-intl';
import { toast } from 'sonner';

import { messages, resolveLocale } from '@/shared/i18n';

import type { MessageKey } from './mutation-feedback.types';

const translate = (key: MessageKey) => {
  const locale = resolveLocale(document.documentElement.lang);

  return createTranslator({ locale, messages: messages[locale] })(key);
};

export const createMutationCache = () =>
  new MutationCache({
    onSuccess: (_data, _variables, _result, _mutation, { client, meta }) => {
      if (meta?.successKey) {
        toast.success(translate(meta.successKey));
      }

      return Promise.all((meta?.invalidates ?? []).map((queryKey) => client.invalidateQueries({ queryKey })));
    },
    onError: (error, _variables, _result, _mutation, { meta }) => {
      const key = typeof meta?.errorKey === 'function' ? meta.errorKey(error) : meta?.errorKey;

      if (key) {
        toast.error(translate(key));
      }
    }
  });
