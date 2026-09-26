'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { rotateTacticBoardTokens } from '@/shared/api/tactics';
import { SITE } from '@/shared/config';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { localePath, resolveLocale } from '@/shared/i18n';
import { isBrowser } from '@/shared/lib';

import type { UseUpdateBoardInput } from '../use-update-board';

import { boardShareLinks } from '../../../lib/share-links';

export const useSharePanel = ({ board, token }: UseUpdateBoardInput) => {
  const t = useTranslations('tactics.toast');
  const locale = resolveLocale(useLocale());
  const queryClient = useQueryClient();
  const rotate = useMutation({
    mutationFn: () => rotateTacticBoardTokens(board.id),
    onSuccess: (next) => {
      queryClient.setQueryData(QUERY_KEYS.tactics.board({ id: board.id, token }), next);
      toast.success(t('rotated'));
    },
    onError: () => toast.error(t('failed'))
  });

  const links = boardShareLinks({
    origin: isBrowser() ? window.location.origin : SITE.url,
    path: localePath({ path: ROUTES.tacticBoard(board.id), locale }),
    shareToken: board.shareToken,
    editToken: board.editToken
  });

  const onRotate = () => rotate.mutate();

  return { links, isPublic: board.visibility === 'public', isPrivate: board.visibility === 'private', isRotating: rotate.isPending, onRotate };
};
