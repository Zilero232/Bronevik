import type { ShowcaseTank } from '../model/showcase.types';

export type TankShowcase3DProps = {
  tank?: ShowcaseTank;
  tanks?: readonly ShowcaseTank[];
  className?: string;
};
