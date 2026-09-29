import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { getGamefaceStatus } from '../../../api';

export const useGamefaceNotice = () => {
  const t = useTranslations('common');

  return async (clientPath: string | null) => {
    const status = await getGamefaceStatus(clientPath).catch(() => null);

    if (status?.restartExpected) {
      toast.info(t('gamefaceRestart'));
    }
  };
};
