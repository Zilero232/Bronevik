import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

import { PANEL_SCRIPT } from './panel-script.constants';

export const bundlePanelScript = async (): Promise<string> => {
  const { outputFiles } = await build({ ...PANEL_SCRIPT.build, entryPoints: [PANEL_SCRIPT.entry], write: false });

  return outputFiles.map(({ text }) => text).join('');
};

export const readPanelScript = (): Promise<string> => readFile(PANEL_SCRIPT.outfile, 'utf8');

export const writePanelScript = async (): Promise<void> => writeFile(PANEL_SCRIPT.outfile, await bundlePanelScript());
