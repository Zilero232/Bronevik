import type { PaintContoursInput, PaintMotionInput } from './battle-backdrop-paint.types';

import { BATTLE_BACKDROP, tracerSegment } from '../battle-backdrop';

export const paintContours = ({ context, width, height, segments, color }: PaintContoursInput) => {
  context.clearRect(0, 0, width, height);
  context.globalAlpha = BATTLE_BACKDROP.contourAlpha;
  context.strokeStyle = color;
  context.lineWidth = BATTLE_BACKDROP.contourWidth;
  context.beginPath();

  for (let index = 0; index + 3 < segments.length; index += 4) {
    context.moveTo(segments[index] * width, segments[index + 1] * height);
    context.lineTo(segments[index + 2] * width, segments[index + 3] * height);
  }

  context.stroke();
  context.globalAlpha = 1;
};

export const paintMotion = ({ context, width, height, motes, tracers, now, color, tracerColor }: PaintMotionInput) => {
  const scale = Math.max(width, height);

  context.clearRect(0, 0, width, height);
  context.fillStyle = color;

  for (const mote of motes) {
    const x = mote.x * width;
    const y = mote.y * height;
    const radius = mote.radius * scale;

    context.globalAlpha = mote.alpha;

    if (mote.isSmoke) {
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');
      context.fillStyle = gradient;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      context.fillStyle = color;
    } else {
      context.beginPath();
      context.arc(x, y, Math.max(radius, 0.6), 0, Math.PI * 2);
      context.fill();
    }
  }

  context.lineCap = 'round';
  context.lineWidth = BATTLE_BACKDROP.tracer.width;

  for (const tracer of tracers) {
    const segment = tracerSegment({ tracer, now });

    if (segment) {
      const gradient = context.createLinearGradient(
        segment.tail[0] * width,
        segment.tail[1] * height,
        segment.head[0] * width,
        segment.head[1] * height
      );

      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(1, tracerColor);
      context.globalAlpha = BATTLE_BACKDROP.tracer.alpha * segment.fade;
      context.strokeStyle = gradient;
      context.beginPath();
      context.moveTo(segment.tail[0] * width, segment.tail[1] * height);
      context.lineTo(segment.head[0] * width, segment.head[1] * height);
      context.stroke();
    }
  }

  context.globalAlpha = 1;
};
