export const CHART_SPECIMENS = {
  lineA: [42, 48, 45, 53, 58, 55, 61, 66, 63, 70, 74, 71, 78, 82],
  lineB: [38, 36, 41, 44, 40, 47, 45, 50, 49, 53, 51, 56, 55, 59],
  area: [50.2, 50.6, 49.8, 51.1, 51.4, 50.9, 51.8, 52.3, 51.6, 52.8, 53.1, 52.4, 53.6, 54],
  bars: [120, 145, 98, 176, 210, 188, 134, 160, 225, 240, 198, 172, 205, 260]
} as const;

export const SPARKLINE_SPECIMEN = [12, 18, 15, 22, 27, 24, 31, 29, 36, 40, 38, 45] as const;

export const AVATAR_SPECIMENS = ['A A', 'B B', 'C C', 'D D', 'E E'] as const;

export const NUMBER_SPECIMEN = {
  initial: 48_211,
  min: 10_000,
  span: 90_000
} as const;
