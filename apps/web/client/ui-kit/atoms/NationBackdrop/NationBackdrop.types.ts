type NationBackdropFade = 'left' | 'radial';

export type NationBackdropProps = {
  nation: string;
  fade?: NationBackdropFade;
  className?: string;
};
