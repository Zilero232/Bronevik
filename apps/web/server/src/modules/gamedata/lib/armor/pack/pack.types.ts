export type PackedArmorModel = {
  bytes: Uint8Array;
  hash: string;
};

export type ArmorStorageKeyInput = {
  tankId: number;
  hash: string;
};
