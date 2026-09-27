export type SignedHeader = {
  name: string;
  value: string;
};

export type SignedMessageInput = {
  method: string;
  path: string;
  timestamp: string;
  nonce: string;
  headers?: readonly SignedHeader[];
  body: Buffer;
};

export type FreshTimestampInput = {
  timestamp: string | undefined;
  now: Date;
};
