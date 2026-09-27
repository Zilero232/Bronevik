export type Rgba = [number, number, number, number];

export type IconColors = {
  background: Rgba;
  accent: Rgba;
};

export type PixelInput = {
  x: number;
  y: number;
  colors: IconColors;
};
