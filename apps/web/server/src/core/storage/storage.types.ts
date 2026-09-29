export type PutObjectInput = {
  key: string;
  body: Uint8Array;
  contentType: string;
};

export type ObjectStorageModuleOptions = {
  root: string;
};
