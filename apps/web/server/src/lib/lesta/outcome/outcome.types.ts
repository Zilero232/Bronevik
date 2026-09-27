export type LestaOutcome = 'degraded' | 'ok' | 'rejected';

export type ClassifyLestaResponseInput = {
  status: number;
  errorCode: string | null;
};
