export const PY_KEYWORDS = {
  True: true,
  False: false,
  None: null
} as const;

export const PY_ESCAPES: Record<string, string> = {
  n: '\n',
  t: '\t',
  r: '\r',
  '\\': '\\',
  "'": "'",
  '"': '"'
};

export const PY_CLOSERS = {
  '{': '}',
  '[': ']',
  '(': ')'
} as const;

export const PYTHON_LITERAL = {
  identifierStart: /[A-Z_]/i,
  identifierPart: /[\w.]/,
  number: /^-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i
} as const;
