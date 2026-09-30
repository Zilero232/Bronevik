// The client's HUD font (gui/gameface/fonts/Warhelios-Regular.ttf and -Bold.ttf, RU 1.45) has no glyph above U+2000
// but these (read from its cmap): a character outside them draws as a blank box. Known ones get a look-alike the
// font has, any other is dropped.
export const FONT_SAFE = {
  kept: '–—‘’‚“”„†‡•…‰‹›⁴€₴₸₽№™∙',
  firstUnsafe: 0x2000,
  replacements: {
    '−': '-',
    ' ': ' ',
    ' ': ' ',
    ' ': ' ',
    ' ': ' ',
    '≈': '~',
    '→': '›',
    '▶': '›',
    '►': '›',
    '←': '‹',
    '◀': '‹',
    '◄': '‹',
    '★': '*',
    '✓': '+',
    '✔': '+',
    '▲': '+',
    '▼': '-',
    '●': '•',
    '∞': '-'
  }
} as const;
