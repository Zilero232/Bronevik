'use client';

import { useTranslations } from 'next-intl';

import { Badge, buttonVariants, DialogClose, DialogFooter } from '@/ui-kit';

import type { ApplyRequestResultProps } from './ApplyRequestResult.types';

import s from './ApplyRequestResult.module.scss';

export const ApplyRequestResult = ({ status }: ApplyRequestResultProps) => {
  const t = useTranslations('streamerSettings.apply');

  return (
    <div className={s.root}>
      <Badge tone={status === 'pending' ? 'accent' : 'neutral'}>{t(`status.${status}`)}</Badge>
      <p className={s.hint}>{t('sent')}</p>
      <DialogFooter>
        <DialogClose className={buttonVariants({ size: 'sm' })}>{t('done')}</DialogClose>
      </DialogFooter>
    </div>
  );
};
