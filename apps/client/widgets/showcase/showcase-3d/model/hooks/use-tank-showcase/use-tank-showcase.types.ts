import type { ShowcaseTank } from '../../showcase.types';

export type UseTankShowcaseInput = {
  tank?: ShowcaseTank;
  tanks?: readonly ShowcaseTank[];
};
