export type SignedMessageInput = {
  method: string;
  path: string;
  timestamp: string;
  nonce: string;
  body: Buffer;
};

export type FreshTimestampInput = {
  timestamp: string | undefined;
  now: Date;
};
