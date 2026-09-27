export type ParamChangeLine = {
  kind: 'change';
  label: string;
  from: number;
  to: number;
  unit: string | null;
  raw: string;
};

export type ParamValueLine = {
  kind: 'value';
  label: string;
  value: number;
  unit: string | null;
  raw: string;
};

export type ParamLine = ParamChangeLine | ParamValueLine;

export type ValueCell = {
  value: number;
  unit: string | null;
};

export type ToChangeInput = {
  found: RegExpExecArray | null;
  raw: string;
};
