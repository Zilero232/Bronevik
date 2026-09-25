'use client';

import { ArrowUpRight, LoaderCircle, Search, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { Input } from '@/ui-kit';

import { clanAccent } from '../../../lib/clan-accent';
import { useClanSearch } from '../../../model/hooks';

import s from './ClanSearch.module.scss';

export const ClanSearch = () => {
  const t = useTranslations('clans.search');
  const { query, setQuery, results, isEnabled, isFetching, isError } = useClanSearch();

  const status = match({ isEnabled, isError, isFetching, count: results.length })
    .with({ isEnabled: false }, () => null)
    .with({ isError: true }, () => <p className={s.note}>{t('error')}</p>)
    .with({ isFetching: true, count: 0 }, () => <p className={s.note}>{t('loading')}</p>)
    .with({ count: 0 }, () => <p className={s.note}>{t('empty', { query: query.trim() })}</p>)
    .otherwise(() => null);

  return (
    <div className={s.root}>
      <Input
        aria-label={t('label')}
        autoComplete='off'
        icon={<Search size={18} />}
        placeholder={t('placeholder')}
        size='lg'
        trailing={isFetching && <LoaderCircle aria-hidden className={s.spinner} size={16} />}
        type='search'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div aria-live='polite' className={s.status}>
        {status}
      </div>
      <AnimatePresence mode='popLayout'>
        {results.length > 0 && (
          <motion.ul key={results.map(({ clanId }) => clanId).join()} animate='visible' className={s.results} initial='hidden' variants={STAGGER}>
            {results.map(({ clanId, tag, name, membersCount }) => (
              <motion.li key={clanId} variants={STAGGER_ITEM}>
                <Link className={s.result} href={ROUTES.clan(tag)} style={{ '--clan': clanAccent(tag) }}>
                  <span className={s.tag}>[{tag}]</span>
                  <span className={s.name}>{name}</span>
                  <span className={s.members}>
                    <Users aria-hidden size={14} />
                    {t('members', { count: membersCount })}
                  </span>
                  <ArrowUpRight aria-hidden className={s.arrow} size={16} />
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <span className={s.hint}>{t('hint')}</span>
    </div>
  );
};
