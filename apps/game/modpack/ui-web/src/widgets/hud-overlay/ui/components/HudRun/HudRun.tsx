import clsx from 'clsx';

import type { HudRunProps } from './HudRun.types';

import { imageStyle, textStyle } from '../../../lib/run-style';

import s from './HudRun.module.scss';

export const HudRun = ({ run }: HudRunProps) =>
  run.kind === 'image' ? (
    <img alt='' className={s.image} src={run.src} style={imageStyle(run)} />
  ) : (
    <span className={clsx(run.style.bold && s.bold, run.style.italic && s.italic, run.style.underline && s.underline)} style={textStyle(run)}>
      {run.text}
    </span>
  );
