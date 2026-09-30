import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { SITE_SYNC } from '@/entities/site-sync';
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui-kit';

import type { SyncNowButtonProps } from './SyncNowButton.types';

import { useSyncNow } from '../model/hooks';

import s from './SyncNowButton.module.scss';

export const SyncNowButton = ({ disabled = false }: SyncNowButtonProps) => {
  const t = useTranslations();
  const { conflicts, isConflictOpen, isPending, onSync, onResolve, onConflictOpenChange } = useSyncNow();

  return (
    <>
      <Button disabled={disabled} isPending={isPending} onClick={onSync}>
        {!isPending && <RefreshCw aria-hidden />}
        {t('sync.syncNow')}
      </Button>
      <Dialog open={isConflictOpen} onOpenChange={onConflictOpenChange}>
        <DialogContent role='alertdialog'>
          <DialogHeader>
            <DialogTitle>{t('sync.conflictTitle')}</DialogTitle>
            <DialogDescription>{t('sync.conflictDescription')}</DialogDescription>
          </DialogHeader>
          <ul className={s.lines}>
            {conflicts.map((conflict) => (
              <li key={conflict.library}>{conflict.text}</li>
            ))}
          </ul>
          <div className={s.choices}>
            {SITE_SYNC.resolutions.map((resolution) => (
              <div key={resolution} className={s.choice}>
                <span className={s.choiceText}>{t(`sync.resolutions.${resolution}.hint`)}</span>
                <Button disabled={isPending} variant={resolution === 'merge' ? 'primary' : 'secondary'} onClick={() => onResolve(resolution)}>
                  {t(`sync.resolutions.${resolution}.label`)}
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant='ghost'>{t('common.cancel')}</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
