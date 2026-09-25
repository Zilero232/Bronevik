import type { ApplyModifierInput, MatchesDeviceTagsInput } from './modifiers.types';

const modifierValue = ({ modifier, specialized }: Pick<ApplyModifierInput, 'modifier' | 'specialized'>): number =>
  specialized && modifier.specValue !== undefined ? modifier.specValue : modifier.value;

export const applyModifier = ({ target, modifier, specialized }: ApplyModifierInput): void => {
  const value = modifierValue({ modifier, specialized });
  const current = target[modifier.attribute] ?? (modifier.op === 'mul' ? 1 : 0);

  target[modifier.attribute] = modifier.op === 'mul' ? current * value : current + value;
};

export const matchesDeviceTags = ({ filter, installedTags }: MatchesDeviceTagsInput): boolean =>
  installedTags.some((tags) => filter.required.every((tag) => tags.includes(tag)) && !filter.incompatible.some((tag) => tags.includes(tag)));
