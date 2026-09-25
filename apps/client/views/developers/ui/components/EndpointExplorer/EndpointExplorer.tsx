'use client';

import { BookOpen, SearchX, ServerCrash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { match } from 'ts-pattern';

import { DEVELOPER_PATHS } from '@/shared/api/developer';
import { env } from '@/shared/config';
import { buttonVariants, EmptyState, SectionHeader, Skeleton } from '@/ui-kit';

import { trimBaseUrl } from '../../../lib/curl-example';
import { filterEndpointGroups } from '../../../lib/openapi-endpoints';
import { useEndpointGroups } from '../../../model/hooks';
import { EndpointFilter, EndpointGroupList } from './components';

import s from './EndpointExplorer.module.scss';

const SKELETON_ROWS = 6;

export const EndpointExplorer = () => {
  const t = useTranslations('developers.explorer');
  const { data: groups, isPending, isError } = useEndpointGroups();
  const [query, setQuery] = useState('');

  const visible = filterEndpointGroups({ groups: groups ?? [], query });
  const total = visible.reduce((sum, { endpoints }) => sum + endpoints.length, 0);

  return (
    <section className={s.root} id='reference'>
      <SectionHeader
        action={
          <a
            className={buttonVariants({ variant: 'secondary', size: 'sm' })}
            href={`${trimBaseUrl(env.NEXT_PUBLIC_API_URL)}${DEVELOPER_PATHS.docs}`}
            rel='noreferrer'
            target='_blank'
          >
            <BookOpen size={15} />
            {t('docs')}
          </a>
        }
        description={t('description')}
        eyebrow={t('eyebrow')}
        index='03'
        title={t('title')}
      />
      <EndpointFilter query={query} total={total} onQueryChange={setQuery} />
      {match({ isPending, isError, total })
        .with({ isPending: true }, () => (
          <div aria-busy className={s.skeleton}>
            {Array.from({ length: SKELETON_ROWS }, (_, index) => (
              <Skeleton key={index} height={52} shape='block' />
            ))}
          </div>
        ))
        .with({ isError: true }, () => <EmptyState code='503' description={t('errorHint')} icon={<ServerCrash size={22} />} title={t('error')} />)
        .with({ total: 0 }, () => <EmptyState description={t('emptyHint')} icon={<SearchX size={22} />} title={t('empty')} />)
        .otherwise(() => (
          <EndpointGroupList groups={visible} />
        ))}
    </section>
  );
};
