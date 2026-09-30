import type { HudSampleProps } from './HudSample.types';

import { FitBox } from '../../../../../shared/ui/fit-box';
import { HudLines } from '../../../../../shared/ui/hud';
import { useHudSample } from '../../model/hooks';

import s from './HudSample.module.scss';

export const HudSample = ({ widget, text, className }: HudSampleProps) => {
  const sample = useHudSample({ widget, text });

  if (sample.isEmpty) {
    return null;
  }

  return (
    <FitBox className={className}>
      <div className={s.sample}>{sample.widget ? sample.widget.node : <HudLines lines={sample.lines} />}</div>
    </FitBox>
  );
};
