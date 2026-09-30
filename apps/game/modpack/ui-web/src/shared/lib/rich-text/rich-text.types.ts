export type RichStyle = {
  color?: string;
  size?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type RichTextRun = { key: string; kind: 'text'; text: string; style: RichStyle };

export type RichImageRun = { key: string; kind: 'image'; src: string; width?: number; height?: number };

export type RichRun = RichImageRun | RichTextRun;

export type RichLine = { key: string; runs: RichRun[] };

export type PushTextInput = { raw: string; start: number };

export type OpenTag = { tag: string; style: RichStyle };

export type ImageRunInput = { attributes: Record<string, string>; key: string };

export type RichLines = {
  lines: RichLine[];
  pushText: (input: PushTextInput) => void;
  breakLine: (key: string) => void;
  pushRun: (run: RichRun) => void;
  open: (tag: OpenTag) => void;
  close: (tag: string) => void;
};

export type ApplyTagInput = { lines: RichLines; match: RegExpExecArray };

export type TagStyleInput = { tag: string; attributes: Record<string, string> };
