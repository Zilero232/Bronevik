'use client';

import { useCopy, useShare } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import type { UseViewerActionsInput } from './use-viewer-actions.types';

import { ARMOR_CANVAS } from '../../../config';

export const useViewerActions = ({ slug, handles }: UseViewerActionsInput) => {
  const t = useTranslations('armor.controls');
  const { supported, trigger } = useShare();
  const { copy } = useCopy();

  const screenshot = () => {
    const url = handles.current?.capture();

    if (!url) {
      return;
    }

    const link = document.createElement('a');

    link.href = url;
    link.download = `${slug}-${ARMOR_CANVAS.screenshotName}.png`;
    link.click();
    toast.success(t('screenshotSaved'));
  };

  const share = async () => {
    const url = window.location.href;

    if (supported) {
      await trigger({ url, title: document.title }).catch(() => undefined);

      return;
    }

    await copy(url);
    toast.success(t('shareCopied'));
  };

  return { screenshot, share };
};
