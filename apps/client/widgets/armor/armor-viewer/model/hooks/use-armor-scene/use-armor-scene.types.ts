import type { ArmorShaderValues } from '@/entities/armor/armor-model';

import type { ScenePart } from '../../../lib/scene-parts';
import type { ArmorHoverEvent } from '../use-armor-hover';

export type UseArmorSceneInput = {
  parts: readonly ScenePart[];
  shader: ArmorShaderValues;
  onHover: (hover: ArmorHoverEvent) => void;
};
