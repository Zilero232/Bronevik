'use client';

import { useState } from 'react';

import { Skeleton } from '@/ui-kit';
import { SessionDetail } from '@/widgets/player/session-detail';

import { SESSIONS } from '../../../config';
import { useProfileContext } from '../../../model/context';
import { usePlayerSessions } from '../../../model/hooks';
import { TabState } from '../TabState';
import { SessionList } from './components';

import s from './SessionsTab.module.scss';

export const SessionsTab = () => {
  const { accountId, nickname } = useProfileContext();

  const [limit, setLimit] = useState<number>(SESSIONS.pageSize);
  const [selected, setSelected] = useState<string | null>(null);

  const { data: page, isPending, isError, isFetching } = usePlayerSessions(limit);

  const sessionId = selected ?? page?.items[0]?.id;

  if (isError) {
    return <TabState kind='error' />;
  }

  if (page?.items.length === 0) {
    return <TabState kind='empty' />;
  }

  return (
    <div className={s.root}>
      {isPending ? (
        <Skeleton className={s.listSkeleton} height={520} shape='block' />
      ) : (
        <SessionList
          hasMore={page.total > page.items.length}
          isFetching={isFetching}
          items={page.items}
          selectedId={sessionId}
          onMore={() => setLimit((current) => current + SESSIONS.pageSize)}
          onSelect={setSelected}
        />
      )}
      <div className={s.detail}>{sessionId && <SessionDetail accountId={accountId} nickname={nickname} sessionId={sessionId} />}</div>
    </div>
  );
};
