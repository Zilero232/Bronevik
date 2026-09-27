export type AssertMtClientInput = {
  label: string;
  version: string | undefined;
  guid: string;
  readme?: string;
};

export type CompareEncyclopediaVersionInput = {
  clientVersion: string;
  encyclopediaVersion: string;
};

export type EncyclopediaVersionCheck = {
  matches: boolean;
  client: string;
  encyclopedia: string;
};
