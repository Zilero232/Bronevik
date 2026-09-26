import { isUtf8 } from 'node:buffer';
import { globSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';

const SOURCES = {
  roots: ['apps', 'packages'],
  extensions: ['ts', 'tsx', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', 'scss', 'md', 'ftl', 'py', 'prisma', 'sql', 'yml', 'yaml'],
  skipDirs: new Set(['node_modules', '.next', 'generated', 'dist', 'coverage', '__pycache__'])
};

const files = globSync(`{${SOURCES.roots.join(',')}}/**/*.{${SOURCES.extensions.join(',')}}`, {
  exclude: (path) => SOURCES.skipDirs.has(basename(path))
});

const broken = files.filter((path) => !isUtf8(readFileSync(path)));

if (broken.length > 0) {
  console.error(`Not valid UTF-8, re-save these files as UTF-8:\n${broken.map((path) => `  ${path}`).join('\n')}`);
  process.exit(1);
}

console.log(`UTF-8: ${files.length} source files ok`);
