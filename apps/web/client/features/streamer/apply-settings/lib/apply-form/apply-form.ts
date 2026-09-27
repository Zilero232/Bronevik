import type { ApplicableGroup, CreateApplyRequestInput, StreamerSettings } from '@otmetki/schemas';

import { STREAMER_SETTINGS_APPLICABLE, STREAMER_SETTINGS_HARDWARE_SPECIFIC } from '@otmetki/schemas';

import { settingsRows } from '@/entities/streamer/settings';

import type { HardwareOptions, HardwareOptionsInput, ToApplyRequestInput } from './apply-form.types';

export const applicableGroups = (settings: StreamerSettings): ApplicableGroup[] =>
  STREAMER_SETTINGS_APPLICABLE.filter((group) => settingsRows({ settings, group }).length > 0);

const hasAny = (group: Record<string, unknown> | undefined, keys: readonly string[]): boolean =>
  keys.some((key) => group?.[key] !== undefined && group[key] !== null);

export const hardwareOptions = ({ settings, groups }: HardwareOptionsInput): HardwareOptions => ({
  hasResolution: groups.includes('display') && hasAny(settings.display, STREAMER_SETTINGS_HARDWARE_SPECIFIC.display),
  hasSensitivity: groups.includes('controls') && hasAny(settings.controls, STREAMER_SETTINGS_HARDWARE_SPECIFIC.controls)
});

export const toApplyRequest = ({ slug, values, options }: ToApplyRequestInput): CreateApplyRequestInput => ({
  slug,
  groups: values.groups,
  includeResolution: options.hasResolution && values.includeResolution,
  includeSensitivity: options.hasSensitivity && values.includeSensitivity
});
