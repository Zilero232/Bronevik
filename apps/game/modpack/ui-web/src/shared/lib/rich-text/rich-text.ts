import type { OpenTag, PushTextInput, RichLine, RichStyle } from './rich-text.types';

import { RICH_TEXT } from './rich-text.constants';

// Gameface runs an unknown V8 and the bundle targets es2017 syntax only (README «In-game UI»), so the
// runtime avoids matchAll, Object.hasOwn and Array#at.
const ENTITIES = new Map<string, string>(Object.entries(RICH_TEXT.entities));
const STYLE_TAGS = new Map<string, RichStyle>(Object.entries(RICH_TEXT.styleTags));
const LINE_BREAK_TAGS = new Set<string>(RICH_TEXT.lineBreakTags);

const matchesOf = (pattern: RegExp, text: string): RegExpExecArray[] => {
  const found: RegExpExecArray[] = [];
  const scan = new RegExp(pattern.source, pattern.flags);

  for (let match = scan.exec(text); match; match = scan.exec(text)) {
    found.push(match);
  }

  return found;
};

const decodeEntities = (text: string): string =>
  text.replace(RICH_TEXT.entity, (whole, name: string) => {
    const lower = name.toLowerCase();

    if (lower.startsWith('#x')) {
      return String.fromCodePoint(Number.parseInt(lower.slice(2), 16));
    }

    if (lower.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(lower.slice(1), 10));
    }

    return ENTITIES.get(lower) ?? whole;
  });

const attributesOf = (source: string): Record<string, string> => {
  const found: Record<string, string> = {};

  for (const match of matchesOf(RICH_TEXT.attribute, source)) {
    const [, name = '', double, single] = match;

    found[name.toLowerCase()] = decodeEntities(double ?? single ?? '');
  }

  return found;
};

const positive = (value: string | undefined): number | undefined => {
  const number = Number(value);

  return value !== undefined && Number.isFinite(number) && number > 0 ? number : undefined;
};

const fontStyle = (attributes: Record<string, string>): RichStyle => {
  const style: RichStyle = {};
  const size = positive(attributes.size);

  if (attributes.color !== undefined && RICH_TEXT.color.test(attributes.color)) {
    style.color = attributes.color.toUpperCase();
  }

  if (size !== undefined) {
    style.size = size;
  }

  return style;
};

const tagStyle = (tag: string, attributes: Record<string, string>): RichStyle | null => {
  if (tag === 'font') {
    return fontStyle(attributes);
  }

  return STYLE_TAGS.get(tag) ?? null;
};

export const parseRichText = (html: string): RichLine[] => {
  const lines: RichLine[] = [{ key: '0', runs: [] }];
  const open: OpenTag[] = [];
  const current = (): RichStyle => open.reduce<RichStyle>((merged, { style }) => ({ ...merged, ...style }), {});
  const lastRuns = (): RichLine['runs'] => lines[lines.length - 1]?.runs ?? [];

  const pushText = ({ raw, start }: PushTextInput): void => {
    decodeEntities(raw)
      .split(RICH_TEXT.newline)
      .forEach((part, index) => {
        const key = `${start}.${index}`;

        if (index > 0) {
          lines.push({ key, runs: [] });
        }

        if (part) {
          lastRuns().push({ key, kind: 'text', text: part, style: current() });
        }
      });
  };

  let last = 0;

  for (const match of matchesOf(RICH_TEXT.tag, html)) {
    const [whole, closing, name = '', rawAttributes = ''] = match;
    const tag = name.toLowerCase();
    const attributes = attributesOf(rawAttributes);

    pushText({ raw: html.slice(last, match.index), start: last });
    last = match.index + whole.length;

    if (LINE_BREAK_TAGS.has(tag)) {
      lines.push({ key: String(last), runs: [] });
    } else if (tag === 'img' && !closing && attributes.src?.startsWith(RICH_TEXT.imageScheme)) {
      lastRuns().push({
        key: String(match.index),
        kind: 'image',
        src: attributes.src,
        width: positive(attributes.width),
        height: positive(attributes.height)
      });
    } else if (closing) {
      const index = open.map((item) => item.tag).lastIndexOf(tag);

      if (index !== -1) {
        open.splice(index);
      }
    } else {
      const style = tagStyle(tag, attributes);

      if (style) {
        open.push({ tag, style });
      }
    }
  }

  pushText({ raw: html.slice(last), start: last });

  return lines;
};
