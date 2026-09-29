import { modpackManagerReleaseSchema, modpackReleaseIndexSchema, modpackReleaseSchema } from '@otmetki/schemas';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { MODPACK_RELEASES_SOURCE } from '../src/modules/modpack-releases/config';
import {
  buildRelease,
  catalogPackages,
  isPublished,
  mergeReleaseIndex,
  modpackCatalogSchema,
  modpackReleaseManifestSchema,
  RELEASE_BUILD,
  RELEASE_SOURCE,
  releasePayload
} from '../src/modules/modpack-releases/lib';

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    version: { type: 'string' },
    games: { type: 'string' },
    catalog: { type: 'string' },
    packages: { type: 'string' },
    'base-url': { type: 'string' },
    out: { type: 'string' },
    current: { type: 'string' },
    release: { type: 'string' },
    signature: { type: 'string' },
    'manager-version': { type: 'string' },
    'manager-url': { type: 'string' },
    'manager-signature': { type: 'string' },
    manifest: { type: 'string', default: RELEASE_SOURCE.manifestFile },
    force: { type: 'boolean', default: false }
  }
});

const required = (name: Exclude<keyof typeof values, 'force'>): string => {
  const value = values[name]?.trim();

  if (!value) {
    console.error(`--${name} is required`);
    process.exit(1);
  }

  return value;
};

const sha256 = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

const readText = async (path: string) => (await readFile(path, 'utf8')).trim();

const readOptional = (path: string) =>
  readFile(path, 'utf8').catch((error: unknown) => {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return '';
    }

    throw error;
  });

const unsignedReleaseSchema = modpackReleaseSchema.omit({ signature: true });

const readIndex = async (path: string) => {
  const current = await readOptional(path);

  return modpackReleaseIndexSchema.parse(current.trim() === '' ? MODPACK_RELEASES_SOURCE.emptyIndex : JSON.parse(current));
};

// Prints version=… and games=… (the lines release.yml appends to $GITHUB_OUTPUT) from the modpack
// package.json; with --current, refuses a version that is already published unless --force.
const source = async () => {
  const {
    version,
    otmetki: { games }
  } = modpackReleaseManifestSchema.parse(JSON.parse(await readFile(required('manifest'), 'utf8')));

  if (values.current && isPublished({ index: await readIndex(values.current), version })) {
    if (!values.force) {
      console.error(`modpack ${version} is already published: bump "version" in ${required('manifest')} or run with force`);
      process.exit(1);
    }

    console.error(`modpack ${version} is already published: force replaces it`);
  }

  console.log(`version=${version}`);
  console.log(`games=${games.join(',')}`);
};

const prepare = async () => {
  const version = required('version');
  const out = required('out');
  const catalogBytes = await readFile(required('catalog'));
  const catalog = modpackCatalogSchema.parse(JSON.parse(catalogBytes.toString('utf8')));

  if (catalog.modpackVersion !== version) {
    console.error(`the catalogue is modpack ${catalog.modpackVersion}, not ${version}`);
    process.exit(1);
  }

  const packages = await Promise.all(
    catalogPackages(catalog).map(async ({ id, file }) => {
      const bytes = await readFile(join(required('packages'), file));

      return { id, file, sha256: sha256(bytes), size: bytes.byteLength };
    })
  );

  const release = unsignedReleaseSchema.parse(
    buildRelease({
      version,
      games: required('games')
        .split(',')
        .map((pattern) => pattern.trim())
        .filter((pattern) => pattern.length > 0),
      publishedAt: new Date().toISOString(),
      baseUrl: required('base-url').replace(/\/+$/u, ''),
      catalog,
      catalogSha256: sha256(catalogBytes),
      packages
    })
  );

  await mkdir(out, { recursive: true });
  await writeFile(join(out, 'release.json'), `${JSON.stringify(release, null, 2)}\n`);
  await writeFile(join(out, 'release.txt'), releasePayload(release));

  console.log(`✓ modpack ${release.version}: ${release.packages.length} packages, payload in ${join(out, 'release.txt')}`);
};

const index = async () => {
  const previous = await readIndex(required('current'));
  const release = unsignedReleaseSchema.parse(JSON.parse(await readText(required('release'))));

  const manager = modpackManagerReleaseSchema.parse({
    version: required('manager-version'),
    publishedAt: new Date().toISOString(),
    notes: '',
    platforms: { [RELEASE_BUILD.managerPlatform]: { url: required('manager-url'), signature: await readText(required('manager-signature')) } }
  });

  const merged = modpackReleaseIndexSchema.parse(
    mergeReleaseIndex({ index: previous, release: { ...release, signature: await readText(required('signature')) }, manager })
  );

  await writeFile(required('out'), `${JSON.stringify(merged, null, 2)}\n`);

  console.log(`✓ release index: ${merged.releases.map((item) => item.version).join(', ')}; manager ${manager.version}`);
};

const commands = { source, prepare, index };
const command = positionals[0];

if (command !== 'source' && command !== 'prepare' && command !== 'index') {
  console.error('Usage: bun scripts/modpack-release.ts source|prepare|index [options] (docs/ops/deploy.md §4)');
  process.exit(1);
}

await commands[command]();
