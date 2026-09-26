import type { TurretYawInput } from './turret-yaw.types';

const smoothstep = (value: number) => value * value * (3 - 2 * value);

export const turretYaw = ({ seconds, amplitude, period }: TurretYawInput): number => {
  if (period <= 0 || amplitude === 0) {
    return 0;
  }

  const phase = (((seconds / period) % 1) + 1) % 1;
  const quarter = Math.floor(phase * 4);
  const local = smoothstep(phase * 4 - quarter);
  const path = [local, 1 - local, -local, local - 1][quarter] ?? 0;

  return amplitude * path;
};
