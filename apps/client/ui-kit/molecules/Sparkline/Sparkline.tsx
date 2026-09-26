import { curveMonotoneX } from '@visx/curve';
import { scaleLinear } from '@visx/scale';
import { AreaClosed, LinePath } from '@visx/shape';
import { clsx } from 'clsx';

import type { SparklineProps } from './Sparkline.types';

import { SPARKLINE } from './Sparkline.constants';

import s from './Sparkline.module.scss';

export const Sparkline = ({ data, width = 120, height = 36, tone = 'accent', withArea = false, label, className }: SparklineProps) => {
  const values = data.length > 1 ? data : [data[0] ?? 0, data[0] ?? 0];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const x = scaleLinear({ domain: [0, values.length - 1], range: [SPARKLINE.pad, width - SPARKLINE.pad] });
  const y = scaleLinear({ domain: [min, max === min ? min + 1 : max], range: [height - SPARKLINE.pad, SPARKLINE.pad] });
  const points = values.map((value, index) => ({ index, value }));

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
