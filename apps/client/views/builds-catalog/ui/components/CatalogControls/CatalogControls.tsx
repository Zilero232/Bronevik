'use client';

import { BUILD_USAGE } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { VehicleFilters } from '@/features/tank/filter-vehicles';
import { SegmentedControl } from '@/ui-kit';

import { useCatalogState } from '../../../model/hooks';

import s from './CatalogControls.module.scss';

export const CatalogControls = () => {
  const t = useTranslations('buildsCatalog');
  const [{ mode }, setState] = useCatalogState();

  return (
    <div className={s.root}>
      <SegmentedControl
        aria-label={t('modeLabel')}
        options={BUILD_USAGE.modes.map((value) => ({ value, label: t(`modes.${value}`) }))}
        size='sm'
        value={mode}
        onChange={(next) => void setState({ mode: next })}
      />
      <VehicleFilters withPremium={false} />
    </div>
  );
};
