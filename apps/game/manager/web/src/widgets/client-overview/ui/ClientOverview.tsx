import { Layers, PackagePlus, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ClientPicker } from '@/features/client/client-picker';
import { Badge, Button, Card, EmptyState, QueryState } from '@/ui-kit';

import { useClientOverview } from '../model/hooks';

import s from './ClientOverview.module.scss';

export const ClientOverview = () => {
  const t = useTranslations();
  const { clientsQuery, client, isInstalled, modpackVersion, installedAt, enabledCount, totalCount, onInstall, onOpenComponents } =
    useClientOverview();

  return (
    <div className={s.root}>
      <Card title={t('client.title')}>
        <QueryState errorTitle={t('common.loadFailed')} loadingLabel={t('common.loading')} query={clientsQuery} retryLabel={t('common.retry')}>
          {() => (
            <>
              <ClientPicker />
              {client ? (
                <dl className={s.facts}>
                  <div>
                    <dt>{t('client.select')}</dt>
                    <dd>
                      {t('client.version', { version: client.version })} <Badge>{t(`client.branch.${client.branch}`)}</Badge>
                    </dd>
                  </div>
                  <div>
                    <dt>{t('client.modsDir')}</dt>
                    <dd className={s.path}>{client.modsDir}</dd>
                  </div>
                  {client.problem && (
                    <div>
                      <dd>
                        <Badge tone='danger'>{t(`client.problem.${client.problem}`)}</Badge>
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <EmptyState hint={t('client.noneHint')} title={t('client.none')} />
              )}
            </>
          )}
        </QueryState>
      </Card>
      <Card
        actions={
          isInstalled ? (
            <>
              <Button variant='ghost' onClick={onInstall}>
                <SlidersHorizontal aria-hidden />
                {t('home.changeSelection')}
              </Button>
              <Button variant='secondary' onClick={onOpenComponents}>
                <Layers aria-hidden />
                {t('home.openComponents')}
              </Button>
            </>
          ) : (
            <Button disabled={!client || client.problem !== null} onClick={onInstall}>
              <PackagePlus aria-hidden />
              {t('home.installCta')}
            </Button>
          )
        }
        title={t('home.installTitle')}
        tone={isInstalled ? 'default' : 'accent'}
      >
        {isInstalled ? (
          <ul className={s.summary}>
            {modpackVersion && <li>{t('home.modpackVersion', { version: modpackVersion })}</li>}
            <li>{t('home.enabledCount', { enabled: enabledCount, total: totalCount })}</li>
            {installedAt && <li>{t('home.installedAt', { date: installedAt })}</li>}
          </ul>
        ) : (
          <p className={s.hint}>
            {t('home.notInstalled')}. {t('home.notInstalledHint')}
          </p>
        )}
      </Card>
    </div>
  );
};
