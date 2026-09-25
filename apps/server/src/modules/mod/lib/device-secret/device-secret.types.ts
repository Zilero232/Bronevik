export type DeviceSecretInput = {
  deviceId: string;
  serverSecret: string;
};

export type MatchesSecretHashInput = {
  secret: string;
  hash: string;
};
