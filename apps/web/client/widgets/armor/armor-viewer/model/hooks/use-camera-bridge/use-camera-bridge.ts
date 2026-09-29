'use client';

import { useThree } from '@react-three/fiber';
import { animate } from 'motion/react';
import { useEffect, useImperativeHandle, useRef } from 'react';
import { Vector3 } from 'three';

import type { CameraPose } from '../../../lib/camera-sync';
import type { UseCameraBridgeInput } from './use-camera-bridge.types';

import { ARMOR_CAMERA } from '../../../config';
import { orbitStep, presetPosition } from '../../../lib/camera-presets';
import { poseOf, positionOf } from '../../../lib/camera-sync';

export const useCameraBridge = ({ bounds, command, reducedMotion, controlsRef, handles, sync, syncId, isLeader }: UseCameraBridgeInput) => {
  'use no memo';

  const get = useThree((state) => state.get);
  const seenNonceRef = useRef(command.nonce);
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

    if (!controls) {
      return;
    }

    let applying = false;

    const apply = (pose: CameraPose) => {
      const { camera, invalidate } = get();

      applying = true;
      camera.position.set(...positionOf({ pose, target: controls.target.toArray(), radius }));
      controls.update();
      applying = false;
      invalidate();
    };

    const publish = () => {
      if (!applying) {
        sync.publish({ source: syncId, pose: poseOf({ position: get().camera.position.toArray(), target: controls.target.toArray(), radius }) });
      }
    };

    const initial = sync.last();

    if (initial) {
      apply(initial);
    }

    const unsubscribe = sync.subscribe({ id: syncId, listener: apply });

    controls.addEventListener('change', publish);

    return () => {
      unsubscribe();
      controls.removeEventListener('change', publish);
    };
  }, [controlsRef, get, radius, sync, syncId]);

  useEffect(() => {
    const controls = controlsRef.current;

    if (command.nonce === seenNonceRef.current) {
      return;
    }

    seenNonceRef.current = command.nonce;

    if (!isLeader || !controls) {
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
  }, [command, center, radius, reducedMotion, controlsRef, get, isLeader]);
};
