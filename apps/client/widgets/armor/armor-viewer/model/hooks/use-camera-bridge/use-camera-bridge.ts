'use client';

import { useThree } from '@react-three/fiber';
import { animate } from 'motion/react';
import { useEffect, useImperativeHandle } from 'react';
import { Vector3 } from 'three';

import type { UseCameraBridgeInput } from './use-camera-bridge.types';

import { ARMOR_CAMERA } from '../../../config';
import { orbitStep, presetPosition } from '../../../lib/camera-presets';

export const useCameraBridge = ({ bounds, command, reducedMotion, controlsRef, handles }: UseCameraBridgeInput) => {
  'use no memo';

  const get = useThree((state) => state.get);
  const { center, radius } = bounds;

  useImperativeHandle(
    handles,
    () => ({
      capture: () => {
        const { gl, scene, camera } = get();

        gl.render(scene, camera);

        return gl.domElement.toDataURL('image/png');
      },
      orbit: ({ azimuth = 0, polar = 0, zoom = 1 }) => {
        const { camera, invalidate } = get();
        const controls = controlsRef.current;

        if (!controls) {
          return;
        }

        const [x, y, z] = orbitStep({
          position: camera.position.toArray(),
          target: controls.target.toArray(),
          azimuth,
          polar,
          zoom,
          maxRadius: radius * ARMOR_CAMERA.maxRadiusFactor
        });

        camera.position.set(x, y, z);
        controls.update();
        invalidate();
      }
    }),
    [get, controlsRef, radius]
  );

  useEffect(() => {
    const controls = controlsRef.current;

    if (!controls) {
      return;
    }

    controls.target.set(...center);
    controls.update();
    get().invalidate();
  }, [center, controlsRef, get]);

  useEffect(() => {
    const controls = controlsRef.current;

    if (command.nonce === 0 || !controls) {
      return;
    }

    const { camera, invalidate } = get();
    const from = camera.position.clone();
    const to = new Vector3(...presetPosition({ preset: command.preset, center, radius }));
    const fromTarget = controls.target.clone();
    const toTarget = new Vector3(...center);

    const apply = (progress: number) => {
      camera.position.lerpVectors(from, to, progress);
      controls.target.lerpVectors(fromTarget, toTarget, progress);
      controls.update();
      invalidate();
    };

    if (reducedMotion) {
      apply(1);

      return;
    }

    const animation = animate(0, 1, { duration: ARMOR_CAMERA.transitionSeconds, ease: 'easeInOut', onUpdate: apply });

    return () => animation.stop();
  }, [command, center, radius, reducedMotion, controlsRef, get]);
};
