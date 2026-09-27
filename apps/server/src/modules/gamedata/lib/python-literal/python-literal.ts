import type { ParsedLiteral, ParseLiteralAtInput, PyDict, PyValue, ReadAssignmentInput, ReadSequenceInput } from './python-literal.types';

import { PY_CLOSERS, PY_ESCAPES, PY_KEYWORDS, PYTHON_LITERAL } from './python-literal.constants';

const isKeyword = (word: string): word is keyof typeof PY_KEYWORDS => Object.hasOwn(PY_KEYWORDS, word);

export const isPyDict = (value: PyValue | undefined): value is PyDict =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && value.kind === 'dict';

export const parseLiteralAt = ({ source, start }: ParseLiteralAtInput): ParsedLiteral => {
  let pos = start;

  const fail = (message: string): never => {
    throw new Error(`Python literal: ${message} at offset ${pos}`);
  };

  const skip = () => {
    while (pos < source.length) {
      const char = source[pos];

      if (char === '#') {
        while (pos < source.length && source[pos] !== '\n') {
          pos += 1;
        }
      } else if (/\s/.test(char)) {
        pos += 1;
      } else {
        return;
      }
    }
  };

  const expect = (char: string) => {
    skip();

    if (source[pos] !== char) {
      fail(`expected "${char}"`);
    }

    pos += 1;
  };

  const readString = (): string => {
    const quote = source[pos];
    let result = '';

    pos += 1;

    while (pos < source.length && source[pos] !== quote) {
      if (source[pos] === '\\') {
        const next = source[pos + 1];

        result += PY_ESCAPES[next] ?? `\\${next}`;
        pos += 2;
      } else {
        result += source[pos];
        pos += 1;
      }
    }

    if (source[pos] !== quote) {
      fail('unterminated string');
    }

    pos += 1;

    return result;
  };

  const readWord = (): string => {
    const from = pos;

    while (pos < source.length && PYTHON_LITERAL.identifierPart.test(source[pos])) {
      pos += 1;
    }

    return source.slice(from, pos);
  };

  const readSequence = <T>({ closer, readItem }: ReadSequenceInput<T>): T[] => {
    const items: T[] = [];

    skip();

    while (source[pos] !== closer) {
      items.push(readItem());
      skip();

      if (source[pos] === ',') {
        pos += 1;
        skip();
      } else if (source[pos] !== closer) {
        fail(`expected "," or "${closer}"`);
      }
    }

    pos += 1;

    return items;
  };

  const readValue = (): PyValue => {
    skip();

    const char = source[pos];

    if (char === '{') {
      pos += 1;

      const pairs = readSequence({
        closer: PY_CLOSERS['{'],
        readItem: () => {
          const key = readValue();

          expect(':');

          return [String(key), readValue()] as const;
        }
      });

      return { kind: 'dict', entries: Object.fromEntries(pairs) };
    }

    if (char === '[' || char === '(') {
      pos += 1;

      return readSequence({ closer: PY_CLOSERS[char], readItem: readValue });
    }

    if (char === "'" || char === '"') {
      return readString();
    }

    const number = PYTHON_LITERAL.number.exec(source.slice(pos, pos + 32));

    if (number) {
      pos += number[0].length;

      return Number(number[0]);
    }

    if (!PYTHON_LITERAL.identifierStart.test(char ?? '')) {
      return fail(`unexpected "${char ?? 'end of input'}"`);
    }

    const word = readWord();

    if (isKeyword(word)) {
      return PY_KEYWORDS[word];
    }

    skip();

    if (source[pos] !== '(') {
      return { kind: 'name', name: word };
    }

    pos += 1;

    const args: PyValue[] = [];
    const kwargs: Record<string, PyValue> = {};

    readSequence({
      closer: PY_CLOSERS['('],
      readItem: () => {
        skip();

        const mark = pos;
        const key = PYTHON_LITERAL.identifierStart.test(source[pos] ?? '') ? readWord() : '';

        skip();

        if (key && source[pos] === '=' && source[pos + 1] !== '=') {
          pos += 1;
          kwargs[key] = readValue();
        } else {
          pos = mark;
          args.push(readValue());
        }
      }
    });

    return { kind: 'call', name: word, args, kwargs };
  };

  const value = readValue();

  return { value, end: pos };
};

export const readAssignment = ({ source, name }: ReadAssignmentInput): PyValue | undefined => {
  const match = new RegExp(`^${name}\\s*=\\s*`, 'm').exec(source);

  return match ? parseLiteralAt({ source, start: match.index + match[0].length }).value : undefined;
};
