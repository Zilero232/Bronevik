'use client';

import { match } from 'ts-pattern';

import { Skeleton } from '@/ui-kit';

import { useIssueCode, useLinkCelebration, useTelegramStatus } from '../model/hooks';
import { CodeRequest, LinkedPanel, LinkHero, MiniAppCard } from './components';

import s from './TelegramLinkPage.module.scss';

export const TelegramLinkPage = () => {
  const issue = useIssueCode();
  const { data: status, isPending } = useTelegramStatus(Boolean(issue.data));
  const bursts = useLinkCelebration({ isLinked: status?.isLinked, onLinked: issue.reset });

  const botUsername = status?.botUsername ?? null;

  return (
    <div className={s.root}>
      <LinkHero status={status} />
      <div className={s.grid}>
        <div className={s.main}>
          {match({ isPending, status })
            .with({ isPending: true }, () => <Skeleton height={320} shape='block' />)
            .with({ status: { isLinked: true } }, ({ status: linked }) => (
              <LinkedPanel botUsername={botUsername} bursts={bursts} username={linked.username} />
            ))
            .otherwise(() => (
              <CodeRequest
                botUsername={botUsername}
                code={issue.data}
                isIssuing={issue.isPending}
                issuedAt={issue.submittedAt}
                onIssue={() => issue.mutate()}
              />
            ))}
        </div>
        <MiniAppCard botUsername={botUsername} />
      </div>
    </div>
  );
};
