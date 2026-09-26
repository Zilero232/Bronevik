'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ErrorState, PageHeader, Skeleton } from '@/ui-kit';

import { useTelegramLinkPage } from '../model/hooks';
import { CodeRequest, LinkedPanel, MiniAppCard } from './components';

import s from './TelegramLinkPage.module.scss';

export const TelegramLinkPage = () => {
  const t = useTranslations('telegram.header');
  const { status, botUsername, isPending, isFailed, isRetrying, retry, code, issuedAt, isIssuing, onIssue } = useTelegramLinkPage();

  return (
    <div className={s.root}>
      <PageHeader description={t('description')} title={t('title')} />
      <div className={s.grid}>
        {match({ isPending, isFailed, status })
          .with({ isPending: true }, () => <Skeleton height={320} shape='block' />)
          .with({ isFailed: true }, () => <ErrorState isRetrying={isRetrying} onRetry={retry} />)
          .with({ status: { isLinked: true } }, ({ status: linked }) => <LinkedPanel botUsername={botUsername} username={linked.username} />)
          .otherwise(() => (
            <CodeRequest botUsername={botUsername} code={code} isIssuing={isIssuing} issuedAt={issuedAt} onIssue={onIssue} />
          ))}
        <MiniAppCard botUsername={botUsername} />
      </div>
    </div>
  );
};
