export type PyName = {
  kind: 'name';
  name: string;
};

export type PyCall = {
  kind: 'call';
  name: string;
  args: PyValue[];
  kwargs: Record<string, PyValue>;
};

export type PyDict = {
  kind: 'dict';
  entries: Record<string, PyValue>;
};

export type PyValue = boolean | number | string | PyCall | PyDict | PyName | PyValue[] | null;

export type ParsedLiteral = {
  value: PyValue;
  end: number;
};

export type ParseLiteralAtInput = {
  source: string;
  start: number;
};

export type ReadAssignmentInput = {
  source: string;
  name: string;
};
