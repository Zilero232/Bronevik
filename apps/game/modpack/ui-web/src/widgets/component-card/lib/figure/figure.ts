import type { FigureBox, FigurePoint } from './figure.types';

const percent = (value: number): string => `${Math.round(Math.min(1, Math.max(0, value)) * 1000) / 10}%`;

export const percentBox = ({ x, y, w, h }: FigureBox) => ({ left: percent(x), top: percent(y), width: percent(w), height: percent(h) });

export const percentPoint = ({ x, y }: FigurePoint) => ({ left: percent(x), top: percent(y) });
