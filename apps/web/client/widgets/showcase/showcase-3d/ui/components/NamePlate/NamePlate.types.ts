import type { ShowcaseTank } from '../../../model/showcase.types';

export type NamePlateProps = {
  tanks: readonly ShowcaseTank[];
  index: number;
  onSelect: (index: number) => void;
};
