import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { toManagerError } from '../../api';

export const useErrorToast = () => {
  const t = useTranslations('errors');

  return (error: unknown) => {
    toast.error(t(toManagerError(error).code));
  };
};
