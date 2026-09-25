import { mockSeries } from './series';

export const MOCK_SERVER = {
  battlesTracked: 1_284_551_902,
  playersTracked: 4_918_337,
  playersToday: 412_830,
  marksTracked: 3_402_115,
  tanksTracked: 986,
  winRateSeries: mockSeries({ seed: 7, length: 60, base: 49.6, amplitude: 0.35 }),
  battlesSeries: mockSeries({ seed: 11, length: 14, base: 2_100_000, amplitude: 380_000 })
} as const;
