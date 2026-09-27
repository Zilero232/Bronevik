import { build, transform } from 'esbuild';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { TokenMap } from '../tokens/tokens.types';
import type { BuiltFile } from './bundle.types';

import { BUILD } from '../build.constants';
import { hexColor, iconPng } from '../icon/icon';
import { ICON } from '../icon/icon.constants';
import { inlineTokens, parseTokens } from '../tokens/tokens';

const source = (file: string): Promise<string> => readFile(path.resolve(BUILD.root, file), 'utf8');

const iconFile = (tokens: TokenMap): BuiltFile => ({
  name: ICON.file,
  contents: iconPng({
    background: hexColor(tokens.get(ICON.tokens.background) ?? '#000000'),
    accent: hexColor(tokens.get(ICON.tokens.accent) ?? '#ffffff')
  })
});

export const bundleFiles = async (): Promise<BuiltFile[]> => {
  const tokens = parseTokens(await readFile(BUILD.tokensFile, 'utf8'));
  const files: BuiltFile[] = [iconFile(tokens)];

  for (const bundle of BUILD.bundles) {
    const { outputFiles } = await build({ ...BUILD.script, entryPoints: [path.resolve(BUILD.root, bundle.entry)], write: false });
    const style = await transform(inlineTokens({ css: await source(bundle.style.source), tokens }), BUILD.style);

    files.push({ name: bundle.script, contents: outputFiles.map(({ text }) => text).join('') });
    files.push({ name: bundle.style.output, contents: style.code });
    files.push({ name: bundle.page.output, contents: await source(bundle.page.source) });
  }

  return files;
};

export const outputPath = (file: BuiltFile): string => path.resolve(BUILD.outDir, file.name);
