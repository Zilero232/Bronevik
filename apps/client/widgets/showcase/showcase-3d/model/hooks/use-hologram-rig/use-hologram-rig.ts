'use client';

import { useEffect, useMemo } from 'react';
import { BufferAttribute, BufferGeometry, EdgesGeometry } from 'three';

import type { ShowcasePart, ShowcaseRig } from '../../../lib/showcase-rig';

import { HOLOGRAM_SHADING } from '../../../config';
import { createHologramMaterials, disposeHologramMaterials } from '../../../lib/hologram-material';

const partGeometry = ({ piece, position }: ShowcasePart) => {
  const indexed = new BufferGeometry();

  indexed.setAttribute('position', new BufferAttribute(piece.positions, 3));
  indexed.setIndex(new BufferAttribute(piece.indices, 1));

  const fill = indexed.toNonIndexed();

  fill.computeVertexNormals();

  const edges = new EdgesGeometry(indexed, HOLOGRAM_SHADING.edgeThresholdDegrees);

  indexed.dispose();

  return { key: piece.name, position, fill, edges };
};

export const useHologramRig = (rig: ShowcaseRig) => {
  'use no memo';

  const built = useMemo(
    () => ({
      body: rig.body.map(partGeometry),
      turret: rig.turret && { position: rig.turret.position, parts: rig.turret.parts.map(partGeometry) },
      materials: createHologramMaterials({ height: rig.height })
    }),
    [rig]
  );

  useEffect(
    () => () => {
      for (const part of [...built.body, ...(built.turret?.parts ?? [])]) {
        part.fill.dispose();
        part.edges.dispose();
      }

      disposeHologramMaterials(built.materials);
    },
    [built]
  );

  return built;
};
