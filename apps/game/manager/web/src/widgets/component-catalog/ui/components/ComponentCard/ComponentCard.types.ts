import type { CatalogRow } from '../../../lib';

export type ComponentCardProps = {
  clientPath: string | null;
  isInstalled: boolean;
  row: CatalogRow & { previewSrc: string | null };
};
