export type IconNode = [string, Record<string, unknown>][];

export type IconNodes = Map<string, IconNode>;

export type ToneColors = Map<string, string>;

export type SpriteSvgInput = {
  nodes: IconNodes;
  colors: ToneColors;
};
