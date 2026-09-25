export type XmlNode = { [key: string]: XmlValue };

export type XmlValue = string | XmlNode | XmlValue[];

export type IdentifiedNode = {
  name: string;
  id: number;
  value: XmlNode;
};
