import { Layers, Search } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { EmptyState, QueryState, TextInput, ToggleChips } from '@/ui-kit';

import { useComponentCatalog } from '../model/hooks';
import { ComponentCard } from './components';

import s from './ComponentCatalog.module.scss';

export const ComponentCatalog = () => {
  const t = useTranslations();
  const { catalogQuery, clientPath, isInstalled, hasComponents, chips, category, query, rows, onCategoryChange, onQueryChange } =
    useComponentCatalog();

  return (
    <QueryState errorTitle={t('common.loadFailed')} loadingLabel={t('common.loading')} query={catalogQuery} retryLabel={t('common.retry')}>
      {() =>
        hasComponents ? (
          <div className={s.root}>
            <div className={s.filters}>
              <ToggleChips chips={chips} label={t('components.categories')} value={category} onChange={onCategoryChange} />
              <label className={s.search}>
                <Search aria-hidden className={s.searchIcon} />
                <span className={s.srOnly}>{t('components.search')}</span>
                <TextInput
                  placeholder={t('components.searchPlaceholder')}
                  type='search'
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                />
              </label>
            </div>
            {rows.length > 0 ? (
              <ul className={s.list}>
                {rows.map((row) => (
                  <li key={row.id}>
                    <ComponentCard clientPath={clientPath} isInstalled={isInstalled} row={row} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={<Search />} title={t('components.noResults')} />
            )}
          </div>
        ) : (
          <EmptyState hint={t('components.noCatalogHint')} icon={<Layers />} title={t('components.noCatalog')} />
        )
      }
    </QueryState>
  );
};
