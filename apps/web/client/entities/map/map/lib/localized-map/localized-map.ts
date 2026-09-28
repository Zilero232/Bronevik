import type { MapDetail, MapSummary } from '@otmetki/schemas';

import { localizedText } from '@/shared/lib';

import type { LocalizedMapDetailInput, LocalizedMapInput } from './localized-map.types';

export const localizedMap = <T extends MapSummary>({ map, locale }: LocalizedMapInput<T>): T => ({
  ...map,
  name: localizedText({ locale, text: map.name, english: map.nameEn })
});

export const localizedMapDetail = ({ map, locale }: LocalizedMapDetailInput): MapDetail => ({
  ...localizedMap({ map, locale }),
  description: localizedText({ locale, text: map.description, english: map.descriptionEn })
});
