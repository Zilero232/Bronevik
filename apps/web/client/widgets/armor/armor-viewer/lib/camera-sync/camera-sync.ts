import type { Vec3 } from '@otmetki/gamedata';

import type { ArmorPaneKey, CameraPose, CameraPoseListener, CameraSync, PoseOfInput, PositionOfInput } from './camera-sync.types';

export const createCameraSync = (): CameraSync => {
  const listeners = new Map<ArmorPaneKey, CameraPoseListener>();
  let latest: CameraPose | null = null;

  return {
    publish: ({ source, pose }) => {
      latest = pose;

      for (const [id, listener] of listeners) {
        if (id !== source) {
          listener(pose);
        }
      }
    },
    subscribe: ({ id, listener }) => {
      listeners.set(id, listener);

      return () => {
        if (listeners.get(id) === listener) {
          listeners.delete(id);
        }
      };
    },
    last: () => latest
  };
};

export const poseOf = ({ position, target, radius }: PoseOfInput): CameraPose => {
  const offset: Vec3 = [position[0] - target[0], position[1] - target[1], position[2] - target[2]];
  const length = Math.hypot(...offset) || 1;

  return { direction: [offset[0] / length, offset[1] / length, offset[2] / length], zoom: length / radius };
};

export const positionOf = ({ pose, target, radius }: PositionOfInput): Vec3 => {
  const distance = pose.zoom * radius;

  return [target[0] + pose.direction[0] * distance, target[1] + pose.direction[1] * distance, target[2] + pose.direction[2] * distance];
};
