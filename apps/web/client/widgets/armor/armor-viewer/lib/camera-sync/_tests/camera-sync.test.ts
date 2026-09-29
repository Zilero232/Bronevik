import { describe, expect, it, vi } from 'vitest';

import { createCameraSync, poseOf, positionOf } from '../camera-sync';

const POSE = { direction: [0, 0, 1], zoom: 2 } as const satisfies Parameters<typeof positionOf>[0]['pose'];

describe('createCameraSync', () => {
  it('hands a pose to the other pane but never back to its source', () => {
    const sync = createCameraSync();
    const primary = vi.fn();
    const secondary = vi.fn();

    sync.subscribe({ id: 'primary', listener: primary });
    sync.subscribe({ id: 'secondary', listener: secondary });
    sync.publish({ source: 'primary', pose: POSE });

    expect(secondary).toHaveBeenCalledWith(POSE);
    expect(primary).not.toHaveBeenCalled();
  });

  it('remembers the last pose for a pane that mounts later', () => {
    const sync = createCameraSync();

    expect(sync.last()).toBeNull();
    sync.publish({ source: 'primary', pose: POSE });
    expect(sync.last()).toBe(POSE);
  });

  it('stops calling a pane once it unsubscribes', () => {
    const sync = createCameraSync();
    const secondary = vi.fn();
    const unsubscribe = sync.subscribe({ id: 'secondary', listener: secondary });

    unsubscribe();
    sync.publish({ source: 'primary', pose: POSE });

    expect(secondary).not.toHaveBeenCalled();
  });

  it('keeps a newer listener when a stale one unsubscribes', () => {
    const sync = createCameraSync();
    const stale = vi.fn();
    const fresh = vi.fn();
    const unsubscribeStale = sync.subscribe({ id: 'secondary', listener: stale });

    sync.subscribe({ id: 'secondary', listener: fresh });
    unsubscribeStale();
    sync.publish({ source: 'primary', pose: POSE });

    expect(fresh).toHaveBeenCalledOnce();
  });
});

describe('poseOf and positionOf', () => {
  it('frames two models of different size from the same angle and relative distance', () => {
    const pose = poseOf({ position: [3, 4, 0], target: [0, 0, 0], radius: 2.5 });
    const position = positionOf({ pose, target: [10, 0, 0], radius: 5 });

    expect(pose.zoom).toBeCloseTo(2);
    expect(position[0]).toBeCloseTo(16);
    expect(position[1]).toBeCloseTo(8);
    expect(position[2]).toBeCloseTo(0);
  });

  it('round-trips a camera position for the same model', () => {
    const position = [1, 2, 3] as const;
    const target = [0.5, 0, -1] as const;
    const back = positionOf({ pose: poseOf({ position: [...position], target: [...target], radius: 1.7 }), target: [...target], radius: 1.7 });

    back.forEach((value, index) => expect(value).toBeCloseTo(position[index]));
  });
});
