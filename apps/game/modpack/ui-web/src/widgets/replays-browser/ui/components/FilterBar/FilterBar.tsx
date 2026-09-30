import type { BattleType, ReplayNation } from '../../../../../entities/replays';
import type { FilterBarProps } from './FilterBar.types';

import { REPLAY_FILTER, romanTier } from '../../../../../entities/replays';
import { useReplaysT } from '../../../model/hooks';
import { Dropdown } from '../Dropdown';

import s from './FilterBar.module.scss';

export const FilterBar = ({ browser }: FilterBarProps) => {
  const t = useReplaysT();
  const { filters, facets } = browser;

  return (
    <div className={s.bar}>
      <Dropdown
        active={filters.map !== null}
        label={t('filterMap')}
        options={[{ value: null, label: t('anyMap') }, ...facets.maps.map((map) => ({ ...map, hint: String(map.count) }))]}
        value={filters.map}
        onSelect={(map) => browser.patch({ map })}
      />
      <Dropdown
        options={[
          { value: null, label: t('anyVehicle') },
          ...facets.vehicles.map((vehicle) => ({
            value: vehicle.value,
            label: [romanTier(vehicle.tier), vehicle.label].filter(Boolean).join(' '),
            hint: String(vehicle.count)
          }))
        ]}
        active={filters.vehicle !== null}
        label={t('filterVehicle')}
        value={filters.vehicle}
        onSelect={(vehicle) => browser.patch({ vehicle })}
      />
      <Dropdown<ReplayNation | null>
        options={[
          { value: null, label: t('anyNation') },
          ...facets.nations.map((nation) => ({ value: nation.value, label: t(`nation_${nation.value}`), hint: String(nation.count) }))
        ]}
        active={filters.nation !== null}
        label={t('filterNation')}
        value={filters.nation}
        onSelect={(nation) => browser.patch({ nation })}
      />
      <Dropdown
        options={[
          { value: null, label: t('any') },
          ...facets.tiers.map((tier) => ({ value: tier.value, label: romanTier(tier.value) ?? tier.label, hint: String(tier.count) }))
        ]}
        active={filters.tier !== null}
        label={t('filterTier')}
        value={filters.tier}
        onSelect={(tier) => browser.patch({ tier })}
      />
      <Dropdown<BattleType | null>
        options={[
          { value: null, label: t('any') },
          ...facets.types.map((type) => ({ value: type.value, label: t(`type_${type.value}`), hint: String(type.count) }))
        ]}
        active={filters.type !== null}
        label={t('filterType')}
        value={filters.type}
        onSelect={(type) => browser.patch({ type })}
      />
      <Dropdown
        active={filters.period !== REPLAY_FILTER.all}
        label={t('filterPeriod')}
        options={REPLAY_FILTER.periods.map((period) => ({ value: period, label: t(`period_${period}`) }))}
        value={filters.period}
        onSelect={(period) => browser.patch({ period })}
      />
      {browser.activeFilters > 0 && (
        <button className={s.reset} type='button' onClick={browser.reset}>
          {t('resetFilters')}
          <span className={s.resetCount}>{browser.activeFilters}</span>
        </button>
      )}
    </div>
  );
};
