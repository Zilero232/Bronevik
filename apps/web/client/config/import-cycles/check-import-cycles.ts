import madge from 'madge';
import path from 'node:path';

const CLIENT_ROOT = path.resolve(import.meta.dirname, '../..');
const LAYERS = ['views', 'widgets', 'features', 'entities', 'shared', 'ui-kit'];

const findCycles = async () => {
  const graph = await madge(
    LAYERS.map((layer) => path.join(CLIENT_ROOT, layer)),
    {
      baseDir: CLIENT_ROOT,
      fileExtensions: ['ts', 'tsx'],
      tsConfig: path.join(CLIENT_ROOT, 'tsconfig.json'),
      excludeRegExp: [/\/_tests\//, /\/generated\//, /\.d\.ts$/],
      detectiveOptions: {
        ts: { skipTypeImports: true, skipAsyncImports: true },
        tsx: { skipTypeImports: true, skipAsyncImports: true }
      }
    }
  );

  return graph.circular();
};

void findCycles().then((cycles) => {
  if (cycles.length > 0) {
    console.error(`Runtime import cycles between FSD modules:\n${cycles.map((cycle) => cycle.join(' -> ')).join('\n')}`);
    process.exit(1);
  }

  process.stdout.write('No runtime import cycles\n');
});
