export type RecordedCall = {
  url: string;
  method: string;
  params: Record<string, string>;
};

export type FetchReply = {
  status?: number;
  body: unknown;
};

export type FetchHandler = (call: RecordedCall) => Error | FetchReply;

export type TankStatsFixtureInput = {
  accountId: number;
  tankId: number;
};

export type LestaErrorFixtureInput = {
  code: number;
  message: string;
  field?: string | null;
  value?: string | null;
};

export type OkWithMetaInput = {
  data: unknown;
  meta: Record<string, number>;
};
