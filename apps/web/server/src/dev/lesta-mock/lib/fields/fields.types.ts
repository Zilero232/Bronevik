export type Json = unknown;

export type PickPathInput = {
  source: Json;
  path: readonly string[];
};

export type DeepMergeInput = {
  target: Json;
  source: Json;
};

export type DropPathInput = {
  source: Json;
  path: readonly string[];
};

export type SelectFieldsInput = {
  value: Json;
  fields: readonly string[];
};
