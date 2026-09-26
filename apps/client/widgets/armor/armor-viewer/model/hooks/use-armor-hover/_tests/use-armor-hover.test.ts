import { armorFlags } from '@otmetki/gamedata';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ArmorShellState } from '@/entities/armor/armor-model';

import type { ArmorHoverEvent } from '..';
import type { RayHit } from '../../../../lib/ray-layers';

import { useArmorHover } from '..';
import { ARMOR_CANVAS } from '../../../../config';

const SHELL_STATE: ArmorShellState = { shell: { kind: 'ARMOR_PIERCING', caliber: 100, penetration: 200 }, randomness: 0 };

const WIDTH = ARMOR_CANVAS.tooltipFlipMargin * 4;

const hit = (overrides: Partial<RayHit>): RayHit => ({
  distance: 1,
  piece: 'hull',
  kind: 'hull',
  plate: { name: 'Upper glacis', thickness: 120, flags: 0 },
  cosine: -0.9,
  ...overrides
});

const SCREEN: RayHit = hit({
  distance: 0.5,
  piece: 'screen',
  kind: 'turret',
  plate: { name: 'Side screen', thickness: 10, flags: armorFlags(['spaced']) }
});

const GLACIS: RayHit = hit({});

const event = (hits: RayHit[], x = 10): ArmorHoverEvent => ({ hits, x, y: 20, width: WIDTH });

describe('useArmorHover', () => {
  it('describes the first plate the ray meets', () => {
    const { result } = renderHook(() => useArmorHover({ shellState: SHELL_STATE, hideSpaced: false }));

    act(() => result.current.onHover(event([GLACIS, SCREEN])));

    expect(result.current.hover?.report.first.plate).toBe(SCREEN.plate?.name);
    expect(result.current.hover?.kind).toBe(SCREEN.kind);
  });

  it('looks through spaced armour when it is hidden', () => {
    const { result } = renderHook(() => useArmorHover({ shellState: SHELL_STATE, hideSpaced: true }));

    act(() => result.current.onHover(event([GLACIS, SCREEN])));

    expect(result.current.hover?.report.first.plate).toBe(GLACIS.plate?.name);
    expect(result.current.hover?.kind).toBe(GLACIS.kind);
  });

  it('shows nothing when the ray hits no armour', () => {
    const { result } = renderHook(() => useArmorHover({ shellState: SHELL_STATE, hideSpaced: false }));

    act(() => result.current.onHover(event([hit({ plate: undefined })])));

    expect(result.current.hover).toBeNull();
  });

  it('flips the tooltip only near the right edge', () => {
    const { result } = renderHook(() => useArmorHover({ shellState: SHELL_STATE, hideSpaced: false }));

    act(() => result.current.onHover(event([GLACIS], WIDTH - ARMOR_CANVAS.tooltipFlipMargin)));
    expect(result.current.hover?.flip).toBe(false);

    act(() => result.current.onHover(event([GLACIS], WIDTH - ARMOR_CANVAS.tooltipFlipMargin + 1)));
    expect(result.current.hover?.flip).toBe(true);
  });

  it('clears the tooltip when the pointer leaves', () => {
    const { result } = renderHook(() => useArmorHover({ shellState: SHELL_STATE, hideSpaced: false }));

    act(() => result.current.onHover(event([GLACIS])));
    act(() => result.current.onLeave());

    expect(result.current.hover).toBeNull();
  });
});
