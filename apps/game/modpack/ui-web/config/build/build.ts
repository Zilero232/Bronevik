import { mkdir, writeFile } from 'node:fs/promises';

import { BUILD } from './build.constants';
import { bundleFiles, outputPath } from './bundle/bundle';

const writeBundles = async (): Promise<void> => {
  const files = await bundleFiles();

  await mkdir(BUILD.outDir, { recursive: true });
  await Promise.all(files.map((file) => writeFile(outputPath(file), file.contents)));
  process.stdout.write(`ui-web: ${files.length} files -> ${BUILD.outDir}\n`);
};

void writeBundles();
