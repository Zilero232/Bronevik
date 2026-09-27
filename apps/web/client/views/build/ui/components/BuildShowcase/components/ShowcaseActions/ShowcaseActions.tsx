'use client';

import { Share2, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/ui-kit';

import { useShowcaseActions } from '../../../../../model/hooks';

export const ShowcaseActions = () => {
  const t = useTranslations('builds.showcase.actions');
  const { hasLoadout, onOpenEditor, onShare } = useShowcaseActions();

  return (
    <>
      <Button disabled={!hasLoadout} onClick={onOpenEditor}>
        <Wrench size={16} />
        {t('openEditor')}
      </Button>
      <Button variant='secondary' onClick={onShare}>
        <Share2 size={16} />
        {t('share')}
      </Button>
    </>
  );
};
