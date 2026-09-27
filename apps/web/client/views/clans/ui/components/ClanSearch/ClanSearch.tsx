'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ClanEmblem } from '@/entities/clan/clan';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Input, RetryButton } from '@/ui-kit';

import { useClanSearch } from '../../../model/hooks';

import s from './ClanSearch.module.scss';

export const ClanSearch = () => {
  const t = useTranslations('clans.search');
  const { query, setQuery, results, isEnabled, isFetching, isError, refetch } = useClanSearch();

  return (
    <div className={s.root}>
      <Input
        aria-label={t('label')}
        autoComplete='off'
        icon={<Search size={16} />}
        placeholder={t('placeholder')}
        type='search'
        value={query}
        onChange={(event) => void setQuery(event.target.value)}
      />
      <div aria-live='polite'>
        {match({ isEnabled, isError, isFetching, count: results.length })
          .with({ isEnabled: false }, () => <span className={s.note}>{t('hint')}</span>)
          .with({ isError: true }, () => (
            <div className={s.failure}>
              <span className={s.note}>{t('error')}</span>
              <RetryButton disabled={isFetching} size='sm' variant='ghost' onClick={() => void refetch()} />
            </div>
          ))
          .with({ isFetching: true, count: 0 }, () => <span className={s.note}>{t('loading')}</span>)
          .with({ count: 0 }, () => <span className={s.note}>{t('empty', { query: query.trim() })}</span>)
          .otherwise(() => (
            <ul className={s.results}>
              {results.map(({ clanId, tag, name, emblem, color, membersCount }) => (
                <li key={clanId} className={s.item}>
                  <Link className={s.result} href={ROUTES.clans.detail(tag)}>
                    <ClanEmblem color={color} size='xs' src={emblem} tag={tag} />
                    <span className={s.tag}>[{tag}]</span>
                    <span className={s.name}>{name}</span>
                    <span className={s.members}>{t('members', { count: membersCount })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
};
