import type { ArmorShaderValues } from '@/entities/armor/armor-model';

import type { ScenePart } from '../../../../../lib/scene-parts';
import type { ArmorHoverEvent } from '../../../../../model/hooks';

export type ArmorSceneProps = {
  parts: ScenePart[];
  shader: ArmorShaderValues;
  onHover: (hover: ArmorHoverEvent) => void;
  onLeave: () => void;
};
