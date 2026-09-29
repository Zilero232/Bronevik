import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { PROFILE, saveProfile } from '@/entities/profile';
import { QUERY_KEYS } from '@/shared/config';
import { useSaveNameForm } from '@/shared/lib';

export const useSaveProfileForm = (clientPath: string | null) => {
  const t = useTranslations('profiles');
  const queryClient = useQueryClient();

  return useSaveNameForm({
    maxLength: PROFILE.nameMaxLength,
    message: t('validation.name'),
    save: (name) => saveProfile({ clientPath, name }),
    onSaved: (view) => {
      queryClient.setQueryData(QUERY_KEYS.profiles(clientPath), view);
      toast.success(t('saved'));
    }
  });
};
