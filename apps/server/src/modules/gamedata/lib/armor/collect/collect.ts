import type { VehicleSpec } from '@bronevik/gamedata';

import { gzipSync } from 'node:zlib';

import type { CollectArmorModelsInput, CollectedArmorModels, VehicleOutcome } from './collect.types';

import { errorMessage } from '../../../../../common/lib';
import { parseCollision, parseModelIndex } from '../../parsers/collision';
import { GAME_DATA_SOURCES, MODEL_PATHS } from '../../source';
import { joinArmorModel } from '../join';
import { ARMOR_PACK, packArmorGeometry } from '../pack';
import { ArmorVersionMismatchError } from './collect.errors';

export const collectArmorModels = async ({ data, reader, onProgress }: CollectArmorModelsInput): Promise<CollectedArmorModels> => {
  if (GAME_DATA_SOURCES[data.revision.sourceId].isTest) {
    throw new ArmorVersionMismatchError('Armor models are never imported for a test-server source');
  }

  const version = (await reader.read(MODEL_PATHS.version))?.trim();

  if (!version || version !== data.version) {
    throw new ArmorVersionMismatchError(`Armor mirror is at ${version ?? 'unknown'}, game data is at ${data.version ?? 'unknown'}`);
  }

  const indexJson = await reader.read(MODEL_PATHS.index);

  if (indexJson === undefined) {
    throw new Error(`${MODEL_PATHS.index} is missing from ${reader.revision.owner}/${reader.revision.repo}@${reader.revision.sha}`);
  }

  const index = parseModelIndex(indexJson);
  const shellNames = new Map(data.shells.map((shell) => [shell.shellId, shell.displayName]));

  const buildOne = async (spec: VehicleSpec): Promise<VehicleOutcome> => {
    const folder = index[spec.tag];
    const json = folder ? await reader.read(`${MODEL_PATHS.vehicles}/${folder}/${MODEL_PATHS.collision}`) : undefined;

    if (json === undefined) {
      return { skipped: spec.tag, mismatches: [] };
    }

    try {
      const { geometry, modules, mismatches } = joinArmorModel({ spec, collision: parseCollision(json), shellNames });
      const { bytes, hash } = packArmorGeometry(geometry);
      const gzipped = gzipSync(bytes).byteLength;
      const budget =
        gzipped > ARMOR_PACK.gzipBudgetBytes ? [`${spec.tag}: ${gzipped} B gzipped is over the ${ARMOR_PACK.gzipBudgetBytes} B budget`] : [];

      return { model: { tankId: spec.tankId, tag: spec.tag, bytes, hash, modules }, mismatches: [...mismatches, ...budget] };
    } catch (error) {
      return { skipped: spec.tag, mismatches: [`${spec.tag}: ${errorMessage(error)}`] };
    }
  };

  onProgress?.(`Armor mirror ${reader.revision.owner}/${reader.revision.repo}@${reader.revision.sha} (${version})`);

  const outcomes = await Promise.all(data.vehicles.map(buildOne));

  return {
    version,
    sourceSha: reader.revision.sha,
    models: outcomes.flatMap(({ model }) => (model ? [model] : [])),
    skipped: outcomes.flatMap(({ skipped }) => (skipped ? [skipped] : [])),
    mismatches: outcomes.flatMap(({ mismatches }) => mismatches)
  };
};
