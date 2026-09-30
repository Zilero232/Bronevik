import { describe, expect, it } from 'vitest';

import { onDistinct } from '../on-distinct';

describe(onDistinct, () => {
  it('passes a value on only when it differs from the one before', () => {
    const seen: (string | null)[] = [];
    const apply = onDistinct<string | null>((value) => seen.push(value));

    ['a', 'a', null, null, 'b', 'a'].forEach(apply);

    expect(seen).toEqual(['a', null, 'b', 'a']);
  });
});
