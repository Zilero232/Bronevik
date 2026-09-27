import { curveMonotoneX } from '@visx/curve';
import { AreaClosed, LinePath } from '@visx/shape';
import { clsx } from 'clsx';

import { sparklineLayout } from '@/shared/lib';

import type { SparklineProps } from './Sparkline.types';

import { SPARKLINE } from './Sparkline.constants';

import s from './Sparkline.module.scss';

export const Sparkline = ({ data, width = 120, height = 36, tone = 'accent', withArea = false, label, className }: SparklineProps) => {
  const { points, x, y } = sparklineLayout({ data, width, height, pad: SPARKLINE.pad });

  return (
    <svg
      aria-label={label}
      className={clsx(s.root, className)}
      data-tone={tone}
      height={height}
      role={label ? 'img' : undefined}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      {withArea && (
        <AreaClosed curve={curveMonotoneX} data={points} x={(point) => x(point.index)} y={(point) => y(point.value)} yScale={y}>
          {({ path }) => <path className={s.area} d={path(points) ?? ''} />}
        </AreaClosed>
      )}
      <LinePath curve={curveMonotoneX} data={points} x={(point) => x(point.index)} y={(point) => y(point.value)}>
        {({ path }) => <path className={s.line} d={path(points) ?? ''} />}
      </LinePath>
    </svg>
  );
};
