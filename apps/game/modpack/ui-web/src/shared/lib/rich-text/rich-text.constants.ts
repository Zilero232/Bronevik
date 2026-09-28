// The GUIFlash HTML subset the panels send (core/format `font`, `<img src="img://...">` of the sixth sense
// and crosshair marks): parsed into runs, never set as innerHTML.
export const RICH_TEXT = {
  tag: /<(\/?)([a-z]+)((?:\s+[a-z-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*\/?>/gi,
  attribute: /([a-z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi,
  entity: /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
  color: /^#[0-9a-f]{6}$/i,
  imageScheme: 'img://',
  newline: '\n',
  lineBreakTags: ['br'],
  styleTags: { b: { bold: true }, i: { italic: true }, u: { underline: true } },
  entities: { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'", nbsp: ' ' }
} as const;
