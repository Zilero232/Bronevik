export type SignDeviceTokenInput = {
  deviceId: string;
  secret: string;
};

export type ReadDeviceTokenInput = {
  token: string | undefined;
  secret: string;
};

export type HashIpInput = {
  ip: string;
  secret: string;
};
