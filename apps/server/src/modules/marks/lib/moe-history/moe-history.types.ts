export type HistorySourceRow = {
  tankId: number;
  date: string;
  source: string;
  p65: number;
  p85: number;
  p95: number;
  p100: number | null;
};

export type HistorySeriesInput = {
  rows: readonly HistorySourceRow[];
  tankIds: readonly number[];
};
