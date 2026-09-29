export type QuickPreset<S, Id extends string = string> = {
  id: Id;
  patch: Partial<S>;
};

export type ActivePresetsInput<S, Id extends string = string> = {
  presets: readonly QuickPreset<S, Id>[];
  state: S;
};

export type PresetsPatchInput<S, Id extends string = string> = {
  presets: readonly QuickPreset<S, Id>[];
  active: readonly Id[];
  next: readonly Id[];
};

export type PresetsPatch<S> = { [K in keyof S]?: S[K] | null };
