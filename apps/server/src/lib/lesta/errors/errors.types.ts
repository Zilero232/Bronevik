export type LestaApiErrorInput = {
  code: string;
  message?: string;
  method: string;
  status?: number;
  field?: string | null;
  value?: string | null;
};

export type LestaHttpErrorInput = {
  method: string;
  status: number;
  body?: string;
};

export type LestaNetworkErrorInput = {
  method: string;
  cause: unknown;
};
