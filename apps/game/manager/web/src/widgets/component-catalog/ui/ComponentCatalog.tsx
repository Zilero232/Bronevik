import { Layers, PackagePlus, Search, Sparkles } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button, EmptyState, Notice, QueryState, Switch, TextInput, ToggleChips } from '@/ui-kit';

import { useComponentCatalog } from '../model/hooks';
import { ComponentCard } from './components';

import s from './ComponentCatalog.module.scss';

export const ComponentCatalog = () => {
  const t = useTranslations();
  const {
    catalogQuery,
    clientPath,
    isInstalled,
    hasComponents,
    chips,
    presets,
    category,
    query,
    lightOnly,
    rows,
    onCategoryChange,
    onQueryChange,
    onLightOnlyChange,
    onApplyPreset,
    onInstall
  } = useComponentCatalog();

  return (
    <QueryState errorTitle={t('common.loadFailed')} loadingLabel={t('common.loading')} query={catalogQuery} retryLabel={t('common.retry')}>
      {() =>
        hasComponents ? (
          <div className={s.root}>
            {!isInstalled && (
              <Notice
                actions={
                  <Button size='sm' onClick={onInstall}>
                    <PackagePlus aria-hidden />
                    {t('components.installCta')}
                  </Button>
                }
                tone='warning'
              >
                {t('components.notInstalledHint')}
              </Notice>
            )}
            {presets.length > 0 && (
              <div className={s.presets}>
                <span className={s.presetsLabel}>
                  <Sparkles aria-hidden />
                  {t('components.presetsTitle')}
                </span>
                {presets.map((preset) => (
                  <Button key={preset.id} size='sm' title={t('components.presetsHint')} variant='secondary' onClick={() => onApplyPreset(preset.id)}>
                    {preset.title}
                  </Button>
                ))}
              </div>
            )}
            <div className={s.filters}>
              <ToggleChips chips={chips} label={t('components.categories')} value={category} onChange={onCategoryChange} />
              <Switch
                checked={lightOnly}
                description={t('components.lightOnlyHint')}
                label={t('components.lightOnly')}
                onCheckedChange={onLightOnlyChange}
              />
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
          <EmptyState
            action={
              !isInstalled && (
                <Button onClick={onInstall}>
                  <PackagePlus aria-hidden />
                  {t('components.installCta')}
                </Button>
              )
            }
            hint={t('components.noCatalogHint')}
            icon={<Layers />}
            title={t('components.noCatalog')}
          />
        )
      }
    </QueryState>
  );
};
