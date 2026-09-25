'use client';

import { curveMonotoneX } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { scaleLinear } from '@visx/scale';
import { AreaClosed, LinePath } from '@visx/shape';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

import { DRAW_IN, FADE, REVEAL_VIEWPORT, useSvgId } from '@/shared/lib';

import type { SparklineProps } from './Sparkline.types';

import s from './Sparkline.module.scss';

const PAD = 2;

export const Sparkline = ({ data, width = 120, height = 36, tone = 'accent', withArea = true, label, className }: SparklineProps) => {
  const gradientId = useSvgId('spark');

  const values = data.length > 1 ? data : [data[0] ?? 0, data[0] ?? 0];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const x = scaleLinear({ domain: [0, values.length - 1], range: [PAD, width - PAD] });
  const y = scaleLinear({ domain: [min, max === min ? min + 1 : max], range: [height - PAD, PAD] });
  const points = values.map((value, index) => ({ index, value }));
  const last = points[points.length - 1];

  return (
    <motion.svg
      aria-label={label}
      className={clsx(s.root, className)}
      data-tone={tone}
      height={height}
      initial='hidden'
      role={label ? 'img' : undefined}
      viewBox={`0 0 ${width} ${height}`}
      viewport={REVEAL_VIEWPORT}
      whileInView='visible'
      width={width}
    >
      <LinearGradient className={s.gradient} from='var(--spark)' fromOpacity={0.35} id={gradientId} to='var(--spark)' toOpacity={0} />
      {withArea && (
        <AreaClosed curve={curveMonotoneX} data={points} x={(point) => x(point.index)} y={(point) => y(point.value)} yScale={y}>
          {({ path }) => <motion.path d={path(points) ?? ''} fill={`url(#${gradientId})`} variants={FADE} />}
        </AreaClosed>
      )}
      <LinePath curve={curveMonotoneX} data={points} x={(point) => x(point.index)} y={(point) => y(point.value)}>
        {({ path }) => <motion.path className={s.line} d={path(points) ?? ''} variants={DRAW_IN} />}
      </LinePath>
      {last && <motion.circle className={s.dot} cx={x(last.index)} cy={y(last.value)} r={2.5} variants={FADE} />}
    </motion.svg>
  );
};
