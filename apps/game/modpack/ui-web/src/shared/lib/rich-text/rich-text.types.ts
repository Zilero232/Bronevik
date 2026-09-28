export type RichStyle = {
  color?: string;
  size?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type RichTextRun = { kind: 'text'; text: string; style: RichStyle };

export type RichImageRun = { kind: 'image'; src: string; width?: number; height?: number };

export type RichRun = RichImageRun | RichTextRun;

export type RichLine = RichRun[];

export type OpenTag = { tag: string; style: RichStyle };
