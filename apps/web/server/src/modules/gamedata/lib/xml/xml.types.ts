export type XmlNode = { [key: string]: XmlValue };

export type XmlValue = string | XmlNode | XmlValue[];

export type IdentifiedNode = {
  name: string;
  id: number;
  value: XmlNode;
};

export type XmlGetInput = {
  value: XmlValue | undefined;
  path: string;
};

export type MergeNodesInput = {
  base: XmlNode | undefined;
  override: XmlNode | undefined;
};
