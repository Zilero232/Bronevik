export type ReplayStreamSection = {
  compressedSize: number;
  data: Uint8Array;
  decompressedSize: number;
};

export type ReplayContainer = {
  blocks: Uint8Array[];
  magic: number;
  stream: ReplayStreamSection | null;
};
