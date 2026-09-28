export type SessionEndedEvent = {
  sessionId: string;
  accountId: bigint;
};

export type SessionEventsSink = {
  ended: (event: SessionEndedEvent) => Promise<void>;
};
