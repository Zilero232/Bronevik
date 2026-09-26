import { describe, expect, it } from 'vitest';

import { applyHologramFrame, createHologramMaterials } from '../hologram-material';

describe('hologram materials', () => {
  it('shares the reveal and scan state across fill and edges', () => {
    const materials = createHologramMaterials({ height: 2.5 });

    applyHologramFrame({ materials, reveal: 0.4, scan: 0.7 });

    expect(materials.fill.uniforms.uHeight.value).toBe(2.5);
    expect(materials.fill.uniforms.uReveal.value).toBe(0.4);
    expect(materials.edge.uniforms.uScan.value).toBe(0.7);
    expect(materials.shadow.transparent).toBe(true);
  });
});
