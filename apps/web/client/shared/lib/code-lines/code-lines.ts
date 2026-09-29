import { generate, parse } from 'sugar-high/core';
import { languages } from 'sugar-high/lang';

import type { CodeLine } from './code-lines.types';

import { CODE_LINES } from './code-lines.constants';

const parseOptions = languages.find(({ id }) => id === CODE_LINES.language)?.config;

export const codeLines = (code: string): CodeLine[] =>
  generate(parse(code, parseOptions)).map(({ properties, children }, line) => ({
    key: line,
    isFirst: line === 0,
    className: properties.className,
    tokens: children.map((token, position) => ({
      key: position,
      className: token.properties.className,
      style: token.properties.style,
      value: token.children.map(({ value }) => value).join('')
    }))
  }));
