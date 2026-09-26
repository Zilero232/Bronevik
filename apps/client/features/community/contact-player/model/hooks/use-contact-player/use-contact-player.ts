'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { ROUTES } from '@/shared/constants';
import { useCopyFeedback } from '@/shared/lib';

import type { UseContactPlayerInput } from './use-contact-player.types';

export const useContactPlayer = ({ nickname, accountId }: UseContactPlayerInput) => {
  const t = useTranslations('community.contact');
  const { copied, onCopyClick } = useCopyFeedback({ value: nickname ?? '', onCopy: () => toast.success(t('copied')) });

  return {
    canCopy: nickname !== null,
    copied,
    profileHref: ROUTES.player(nickname ?? String(accountId)),
    onCopy: () => void onCopyClick()
  };
};
