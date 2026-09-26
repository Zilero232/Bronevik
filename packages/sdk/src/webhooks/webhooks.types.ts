export type WebhookHeaders = Record<string, string | string[] | undefined>;

export type VerifyWebhookInput = {
  secret: string;
  body: string;
  headers: WebhookHeaders;
};

export type OtmetkiWebhook = {
  id: string;
  event: string;
  createdAt: string;
  data: Record<string, unknown>;
};
