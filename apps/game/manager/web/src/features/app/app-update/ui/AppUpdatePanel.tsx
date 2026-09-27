import { Download, RefreshCw } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Badge, Button } from '@/ui-kit';

import { useAppUpdate } from '../model/hooks';

import s from './AppUpdatePanel.module.scss';

export const AppUpdatePanel = () => {
  const t = useTranslations('about');
  const { version, isChecking, hasFailed, isInstalling, onCheck, onInstall } = useAppUpdate();

  return (
    <div aria-live='polite' className={s.root}>
      {version && <Badge tone='premium'>{t('updateAvailable', { version })}</Badge>}
      {!version && !hasFailed && !isChecking && <Badge tone='success'>{t('updateCurrent')}</Badge>}
      {hasFailed && <Badge tone='danger'>{t('updateFailed')}</Badge>}
      <div className={s.actions}>
        {version ? (
          <Button isPending={isInstalling} variant='premium' onClick={onInstall}>
            {!isInstalling && <Download aria-hidden />}
            {t('updateInstall')}
          </Button>
        ) : (
          <Button isPending={isChecking} variant='secondary' onClick={onCheck}>
            {!isChecking && <RefreshCw aria-hidden />}
            {t('updateCheck')}
          </Button>
        )}
      </div>
    </div>
  );
};
