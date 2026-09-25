export type ModifierOp = 'add' | 'mul';

export type ModifierCondition = 'active' | 'still' | 'tracked' | 'wheeled';

export type DeviceTagFilter = {
  required: string[];
  incompatible: string[];
};

export type Modifier = {
  attribute: string;
  op: ModifierOp;
  value: number;
  specValue?: number;
  condition?: ModifierCondition;
  requiresDevice?: DeviceTagFilter;
};

export type ApplyModifierInput = {
  target: Record<string, number>;
  modifier: Modifier;
  specialized?: boolean;
};

export type MatchesDeviceTagsInput = {
  filter: DeviceTagFilter;
  installedTags: string[][];
};
