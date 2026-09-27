import path from 'node:path';

export const READ_TOKENS = {
  loadPath: path.resolve(import.meta.dirname, '../..'),
  capture: 'otmetki-capture($root, $themes)',
  source: `
@use 'sass:map';
@use 'index' as tokens;

@function stringify($map) {
  $strings: ();

  @each $name, $value in $map {
    $strings: map.merge($strings, ($name: '#{$value}'));
  }

  @return $strings;
}

$themes: ();

@each $theme, $map in tokens.$themes {
  $themes: map.merge($themes, ($theme: stringify($map)));
}

$captured: otmetki-capture(stringify(tokens.$root), $themes);
`
} as const;
