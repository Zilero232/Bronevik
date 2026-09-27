import { describe, expect, it } from 'vitest';

import { scopedClassName } from '../class-name';

describe('scopedClassName', () => {
  it('names a module class after its component, the same on every machine', () => {
    expect(scopedClassName('root', String.raw`C:\work\ui-web\src\settings\ui\toggle\Toggle.module.scss`)).toBe('otmetki-Toggle__root');
    expect(scopedClassName('knobOn', '/home/ci/ui-web/src/settings/ui/toggle/Toggle.module.scss?used')).toBe('otmetki-Toggle__knobOn');
  });
});
