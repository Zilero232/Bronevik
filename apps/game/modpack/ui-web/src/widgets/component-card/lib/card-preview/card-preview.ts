import type { UiComponent, UiField } from '../../../../shared/api/protocol';
import type { CardPreviewKind, CarouselPreviewModel } from './card-preview.types';

import { CARD_PREVIEWS, CAROUSEL_PREVIEW } from '../../config';

const valueOf = (fields: UiField[], key: string): string | null => {
  const field = fields.find((item) => item.key === key);

  return field ? String(field.value) : null;
};

export const cardPreviewKind = (component: UiComponent): CardPreviewKind | null => {
  if (component.panel) {
    return 'panel';
  }

  const previews: Partial<Record<string, CardPreviewKind>> = CARD_PREVIEWS;

  return previews[component.id] ?? null;
};

export const carouselPreview = (fields: UiField[]): CarouselPreviewModel => {
  const rows = Number(valueOf(fields, CAROUSEL_PREVIEW.rowsKey));

  return {
    rows: Number.isInteger(rows) && rows >= 1 && rows <= CAROUSEL_PREVIEW.maxRows ? rows : null,
    small: valueOf(fields, CAROUSEL_PREVIEW.tilesKey) === CAROUSEL_PREVIEW.smallTiles
  };
};
