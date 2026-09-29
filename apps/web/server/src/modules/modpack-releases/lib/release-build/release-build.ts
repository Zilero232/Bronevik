import type { ModpackReleaseIndex } from '@otmetki/schemas';

import { sortBy } from 'remeda';
import semver from 'semver';

import type { BuildReleaseInput, MergeReleaseIndexInput, ModpackCatalog, ReleasePayloadInput, UnsignedModpackRelease } from './release-build.types';

import { RELEASE_BUILD } from './release-build.constants';

const hex = (digest: string) => digest.trim().toLowerCase();

export const catalogPackages = (catalog: ModpackCatalog): ModpackCatalog['components'] =>
  catalog.components.filter((component) => component.kind !== RELEASE_BUILD.dependencyKind);

export const releasePayload = ({ version, games, catalog, packages }: ReleasePayloadInput): string => {
  const lines = [
    RELEASE_BUILD.payloadHeader,
    `version ${version}`,
    `games ${games.join(',')}`,
    `catalog ${catalog ? hex(catalog.sha256) : RELEASE_BUILD.noCatalog}`,
    ...sortBy(packages, (item) => item.id).map((item) => `package ${item.id} ${item.file} ${item.size} ${hex(item.sha256)}`)
  ];

  return `${lines.join('\n')}\n`;
};

export const buildRelease = ({
  version,
  games,
  publishedAt,
  baseUrl,
  catalog,
  catalogSha256,
  packages
}: BuildReleaseInput): UnsignedModpackRelease => {
  if (catalog.modpackVersion !== version) {
    throw new Error(`The component catalogue is for modpack ${catalog.modpackVersion}, not ${version}`);
  }

  return {
    version,
    publishedAt,
    games,
    notes: null,
    catalog: { url: `${baseUrl}/${RELEASE_BUILD.catalogPath}`, sha256: hex(catalogSha256) },
    packages: packages.map((item) => ({ ...item, sha256: hex(item.sha256), url: `${baseUrl}/${item.file}` }))
  };
};

export const mergeReleaseIndex = ({ index, release, manager }: MergeReleaseIndexInput): ModpackReleaseIndex => {
  const previous = index.releases.find((candidate) => candidate.version === release.version);
  const others = index.releases.filter((candidate) => candidate.version !== release.version);
  const managerPublishedAt = index.manager?.version === manager.version ? index.manager.publishedAt : manager.publishedAt;

  return {
    schemaVersion: index.schemaVersion,
    releases: [...others, { ...release, publishedAt: previous?.publishedAt ?? release.publishedAt }].toSorted((left, right) =>
      semver.rcompare(left.version, right.version)
    ),
    manager: { ...manager, publishedAt: managerPublishedAt }
  };
};
