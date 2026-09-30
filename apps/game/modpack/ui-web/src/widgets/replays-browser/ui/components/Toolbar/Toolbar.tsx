import clsx from 'clsx';

import type { ToolbarProps } from './Toolbar.types';

import { REPLAY_FILTER, REPLAYS } from '../../../../../entities/replays';
import { Button } from '../../../../../shared/ui/button';
import { Segmented } from '../../../../../shared/ui/segmented';
import { REPLAYS_BROWSER } from '../../../config';
import { useReplaysT } from '../../../model/hooks';
import { Dropdown } from '../Dropdown';
import { ReplayIcon } from '../ReplayIcon';

import s from './Toolbar.module.scss';

export const Toolbar = ({ browser }: ToolbarProps) => {
  const t = useReplaysT();
  const { filters } = browser;
  const results = [
    { value: REPLAY_FILTER.all, label: t('resultAll') },
    ...REPLAYS.results.map((result) => ({ value: result, label: t(`result_${result}`) }))
  ];

  return (
    <div className={s.toolbar}>
      <div className={s.search}>
        <ReplayIcon className={s.searchIcon} name='search' size={16} />
        <input
          aria-label={t('search')}
          className={s.searchInput}
          maxLength={REPLAYS_BROWSER.searchMaxLength}
          placeholder={t('search')}
          type='text'
          value={filters.query}
          onInput={(event) => browser.patch({ query: event.currentTarget.value })}
        />
        {filters.query !== '' && (
          <button aria-label={t('clearSearch')} className={s.clear} type='button' onClick={() => browser.patch({ query: '' })}>
            <ReplayIcon name='close' size={12} />
          </button>
        )}
      </div>
      <Segmented
        className={s.results}
        items={results}
        label={t('resultAll')}
        value={filters.result ?? REPLAY_FILTER.all}
        onSelect={(value) => browser.patch({ result: value === REPLAY_FILTER.all ? null : value })}
      />
      <button
        aria-pressed={filters.favourites}
        className={clsx(s.favourites, filters.favourites && s.favouritesOn)}
        type='button'
        onClick={() => browser.patch({ favourites: !filters.favourites })}
      >
        <ReplayIcon name='star' size={14} />
        <span className={s.favouritesLabel}>{t('favourites')}</span>
      </button>
      <div className={s.sort}>
        <Dropdown
          label={t('sortBy')}
          options={REPLAY_FILTER.sorts.map((sort) => ({ value: sort, label: t(`sort_${sort}`) }))}
          value={filters.sort}
          onSelect={browser.sortBy}
        />
        <button
          aria-label={filters.descending ? t('descending') : t('ascending')}
          className={s.direction}
          title={filters.descending ? t('descending') : t('ascending')}
          type='button'
          onClick={() => browser.sortBy(filters.sort)}
        >
          <ReplayIcon name={filters.descending ? 'arrowDown' : 'arrowUp'} size={14} />
        </button>
      </div>
      <div className={s.tools}>
        <Button aria-label={t('refresh')} className={s.tool} size='small' title={t('refresh')} variant='ghost' onClick={browser.refresh}>
          <ReplayIcon name='refresh' size={16} />
        </Button>
        <Button className={s.tool} size='small' variant='ghost' onClick={browser.openFolder}>
          <ReplayIcon className={s.toolIcon} name='folder' size={16} />
          {t('openFolder')}
        </Button>
        <Button className={s.tool} size='small' variant='ghost' onClick={browser.openSiteList}>
          <ReplayIcon className={s.toolIcon} name='external' size={14} />
          {t('siteList')}
        </Button>
      </div>
    </div>
  );
};
