import type { GAMEFACE } from '../gameface.constants';

export type UiSoundName = keyof typeof GAMEFACE.sound.names;

export type UiSound = {
  play: (name: UiSoundName) => void;
};
