import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { parseAsString, parseAsStringLiteral } from 'nuqs/server';

import { STREAMERS_SETTINGS_PAGE } from './streamers-settings.constants';

export const SETTINGS_FILTER_PRESETS = [STREAMERS_SETTINGS_PAGE.allPresets, ...STREAMER_SETTINGS.presets] as const;

export const SETTINGS_FILTER_PARSERS = {
  q: parseAsString.withDefault(''),
  preset: parseAsStringLiteral(SETTINGS_FILTER_PRESETS).withDefault(STREAMERS_SETTINGS_PAGE.allPresets)
} as const;
