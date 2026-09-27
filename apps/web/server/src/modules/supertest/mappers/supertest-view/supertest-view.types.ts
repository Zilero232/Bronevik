import type { CatalogEntry } from '../../../reference';
import type { SupertestAnnouncementRow } from '../../selects';

export type ToAnnouncementInput = {
  row: SupertestAnnouncementRow;
  catalog: ReadonlyMap<number, CatalogEntry>;
};
