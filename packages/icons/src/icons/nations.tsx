import type { SVGProps } from 'react';

import type { Nation } from '../registry';
import type { FlagLayer, NationIconProps, NationPalette } from './icons.types';

import { IconBase } from '../lib';
import { FLAG_FRAME, FLAG_VIEWBOX, NATION_FLAGS } from './nations.shapes';

const FRAME_OPACITY = 0.3;

const Layer = ({ layer, mode }: { layer: FlagLayer; mode: NationPalette }) => {
  const paint = mode === 'color' ? layer.color : 'currentColor';
  const opacity = mode === 'color' ? undefined : layer.mono;

  if (layer.strokeWidth !== undefined) {
    return <path d={layer.d} fill='none' stroke={paint} strokeOpacity={opacity} strokeWidth={layer.strokeWidth} />;
  }

  return <path d={layer.d} fill={paint} fillOpacity={opacity} fillRule={layer.evenOdd ? 'evenodd' : undefined} stroke='none' />;
};

const FlagLayers = ({ nation, mode }: { nation: Nation; mode: NationPalette }) =>
  NATION_FLAGS[nation]
    .filter((layer) => mode === 'color' || layer.mono > 0)
    .map((layer) => <Layer key={`${layer.color}${layer.d}`} layer={layer} mode={mode} />);

export const NationIcon = ({ nation, palette = 'mono', ...props }: NationIconProps & { nation: Nation }) => (
  <IconBase data-palette={palette} name={`nation-${nation}`} {...props}>
    <FlagLayers mode={palette} nation={nation} />
    <path d={FLAG_FRAME} strokeOpacity={palette === 'color' ? FRAME_OPACITY : undefined} strokeWidth={palette === 'color' ? 1 : undefined} />
  </IconBase>
);

export const NationFlag = ({ nation, ...props }: SVGProps<SVGSVGElement> & { nation: Nation }) => (
  <svg aria-hidden preserveAspectRatio='xMidYMid slice' viewBox={FLAG_VIEWBOX} xmlns='http://www.w3.org/2000/svg' {...props}>
    <FlagLayers mode='color' nation={nation} />
  </svg>
);

const nationIcon = (nation: Nation) => {
  const Icon = (props: NationIconProps) => <NationIcon nation={nation} {...props} />;

  Icon.displayName = `nation-${nation}`;

  return Icon;
};

export const UssrIcon = nationIcon('ussr');

export const GermanyIcon = nationIcon('germany');

export const UsaIcon = nationIcon('usa');

export const ChinaIcon = nationIcon('china');

export const FranceIcon = nationIcon('france');

export const UkIcon = nationIcon('uk');

export const JapanIcon = nationIcon('japan');

export const CzechIcon = nationIcon('czech');

export const SwedenIcon = nationIcon('sweden');

export const PolandIcon = nationIcon('poland');

export const ItalyIcon = nationIcon('italy');

export const IntUnionIcon = nationIcon('intunion');
