import type { Vec3 } from '@otmetki/gamedata';

import type { ARMOR_PANES } from '../../config';
import type { ModelBounds } from '../scene-parts';

export type ArmorPaneKey = (typeof ARMOR_PANES)[number];

export type CameraPose = {
  direction: Vec3;
  zoom: number;
};

export type CameraPoseListener = (pose: CameraPose) => void;

type PublishPoseInput = {
  source: ArmorPaneKey;
  pose: CameraPose;
};

type SubscribePoseInput = {
  id: ArmorPaneKey;
  listener: CameraPoseListener;
};

export type CameraSync = {
  publish: (input: PublishPoseInput) => void;
  subscribe: (input: SubscribePoseInput) => () => void;
  last: () => CameraPose | null;
};

export type PoseOfInput = {
  position: Vec3;
  target: Vec3;
  radius: number;
};

export type PositionOfInput = Pick<ModelBounds, 'radius'> & {
  pose: CameraPose;
  target: Vec3;
};
