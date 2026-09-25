export type VerifyWebhookInput = {
  secret: string;
  body: string;
  signature: string | null | undefined;
  timestamp: string | null | undefined;
  toleranceSec?: number;
  now?: Date;
};

export type HmacHexInput = {
  secret: string;
  data: string;
};

export type CompareInput = {
  left: string;
  right: string;
};
