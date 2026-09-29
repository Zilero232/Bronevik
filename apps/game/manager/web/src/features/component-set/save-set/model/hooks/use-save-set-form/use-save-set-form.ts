import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { COMPONENT_SET, saveSet } from '@/entities/component-set';
import { QUERY_KEYS } from '@/shared/config';
import { useSaveNameForm } from '@/shared/lib';

export const useSaveSetForm = (components: string[]) => {
  const t = useTranslations('sets');
  const queryClient = useQueryClient();

  return useSaveNameForm({
    maxLength: COMPONENT_SET.nameMaxLength,
    message: t('validation.name'),
    save: (name) => saveSet({ name, components }),
    onSaved: (view) => {
      queryClient.setQueryData(QUERY_KEYS.sets, view);
      toast.success(t('saved'));
    }
  });
};
