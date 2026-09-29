import { isDeepEqual, mapValues } from 'remeda';

import type { ActivePresetsInput, PresetsPatch, PresetsPatchInput } from './quick-presets.types';

export const activePresets = <S extends object, Id extends string>({ presets, state }: ActivePresetsInput<S, Id>): Id[] => {
  const current = new Map<string, unknown>(Object.entries(state));

  return presets.filter(({ patch }) => Object.entries(patch).every(([key, value]) => isDeepEqual(current.get(key), value))).map(({ id }) => id);
};

export const presetsPatch = <S extends object, Id extends string>({ presets, active, next }: PresetsPatchInput<S, Id>): PresetsPatch<S> => {
  const removed = presets.filter(({ id }) => active.includes(id) && !next.includes(id));
  const added = presets.filter(({ id }) => !active.includes(id) && next.includes(id));
  const cleared = removed.reduce((patch: PresetsPatch<S>, preset) => ({ ...patch, ...mapValues(preset.patch, () => null) }), {});

  return added.reduce((patch: PresetsPatch<S>, preset) => ({ ...patch, ...preset.patch }), cleared);
};
