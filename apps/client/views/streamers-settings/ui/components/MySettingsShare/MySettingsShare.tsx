'use client';

import { Download, GitCompareArrows, Trash2 } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, Card, CardHeader, ConfirmDialog, ErrorState, Skeleton, Switch } from '@/ui-kit';

import { STREAMERS_SETTINGS_PAGE } from '../../../config';
import { useMySettingsShare } from '../../../model/hooks';

import s from './MySettingsShare.module.scss';

export const MySettingsShare = () => {
  const t = useTranslations('streamerSettings.share');
  const format = useFormatter();
  const { isSignedIn, isSessionPending, share, isPending, isError, isRetrying, isRemoving, retry, onAnonymousChange, onRemove } =
    useMySettingsShare();

  if (isSessionPending || !isSignedIn) {
    return null;
  }

  return (
    <Card className={s.root} padding='md' variant='panel'>
      <CardHeader title={t('title')} />
      {isPending && <Skeleton height={96} shape='block' />}
      {isError && <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />}
      {!isPending && !isError && share === null && (
        <>
          <p className={s.meta}>{t('emptyDescription')}</p>
          <ol className={s.steps}>
            <li>{t('steps.install')}</li>
            <li>{t('steps.hangar')}</li>
            <li>{t('steps.target')}</li>
          </ol>
          <Link className={buttonVariants({ variant: 'secondary', size: 'sm', className: s.install })} href={ROUTES.mod}>
            <Download size={STREAMERS_SETTINGS_PAGE.iconSize} />
            {t('installMod')}
          </Link>
        </>
      )}
      {share && (
        <>
          <p className={s.meta}>{t('updated', { date: format.dateTime(new Date(share.updatedAt), 'dateTime') })}</p>
          <Switch checked={share.anonymousStats} description={t('anonymousHint')} label={t('anonymous')} onCheckedChange={onAnonymousChange} />
          <div className={s.actions}>
            <Link
              className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              href={{ pathname: ROUTES.streamers.settings.compare, query: { me: '1' } }}
            >
              <GitCompareArrows size={STREAMERS_SETTINGS_PAGE.iconSize} />
              {t('compare')}
            </Link>
            <ConfirmDialog
              trigger={
                <Button size='sm' variant='ghost'>
                  <Trash2 size={STREAMERS_SETTINGS_PAGE.iconSize} />
                  {t('remove')}
                </Button>
              }
              cancelLabel={t('cancel')}
              confirmLabel={t('remove')}
              description={t('removeDescription')}
              isPending={isRemoving}
              title={t('removeTitle')}
              tone='danger'
              onConfirm={onRemove}
            />
          </div>
        </>
      )}
    </Card>
  );
};
