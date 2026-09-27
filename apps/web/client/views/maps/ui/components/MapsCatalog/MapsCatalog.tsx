import { MapFilters } from '../MapFilters';
import { MapsTable } from '../MapsTable';

import s from './MapsCatalog.module.scss';

export const MapsCatalog = () => (
  <div className={s.root}>
    <MapFilters />
    <MapsTable />
  </div>
);
