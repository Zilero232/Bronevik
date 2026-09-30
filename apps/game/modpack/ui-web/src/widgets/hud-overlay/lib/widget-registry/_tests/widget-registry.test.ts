import { readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { FONT_SAFE } from '../../../../../shared/lib/font-safe';
import { readWidget } from '../../../../../shared/lib/testing/widget-fixture';
import { resolveWidget, widgetKinds, widgetLines } from '../widget-registry';

const FIXTURES = path.resolve(import.meta.dirname, '../../../../../shared/api/hud-protocol/_tests/fixtures/widgets');

describe(resolveWidget, () => {
  it('knows every widget the Python side writes a fixture for', () => {
    const written = readdirSync(FIXTURES).map((file) => file.replace('.sample.json', ''));

    expect(widgetKinds().sort()).toEqual(written.sort());
  });

  it.each(readdirSync(FIXTURES).map((file) => file.replace('.sample.json', '')))(
    'draws the %s fixture only in glyphs the client font has',
    (kind) => {
      const resolved = resolveWidget(readWidget(kind));
      const text = JSON.stringify(resolved?.data);

      expect(Array.from(text).filter((char) => (char.codePointAt(0) ?? 0) >= FONT_SAFE.firstUnsafe && !FONT_SAFE.kept.includes(char))).toEqual([]);
    }
  );

  it.each(readdirSync(FIXTURES).map((file) => file.replace('.sample.json', '')))('accepts the %s fixture', (kind) => {
    const resolved = resolveWidget(readWidget(kind));

    expect(resolved?.kind).toBe(kind);
    expect(resolved && widgetLines(resolved)).toBeGreaterThanOrEqual(1000);
  });

  it('falls back to the text for an unknown kind, another version or data that fails its schema', () => {
    expect(resolveWidget(null)).toBeNull();
    expect(resolveWidget({ kind: 'nope', v: 1, data: {} })).toBeNull();
    expect(resolveWidget({ kind: 'team_hp', v: 2, data: readWidget('team_hp').data })).toBeNull();
    expect(resolveWidget({ kind: 'team_hp', v: 1, data: { style: 'full' } })).toBeNull();
  });
});
