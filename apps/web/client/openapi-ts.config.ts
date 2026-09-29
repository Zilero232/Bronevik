import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: process.env.OTMETKI_OPENAPI_URL ?? './shared/api/openapi/internal.json',
  output: { path: './shared/api/generated', clean: true },
  parser: {
    filters: {
      operations: { exclude: ['/^[A-Z]+ \/v1\//'] }
    },
    transforms: {
      schemaName: (name) => name.replace(/Dto(?:_(?:Output|Input))?$/, '')
    }
  },
  plugins: [
    { name: '@hey-api/client-axios', runtimeConfigPath: './shared/api/http/client-config/client-config', throwOnError: true },
    '@hey-api/typescript',
    'zod',
    { name: '@hey-api/sdk', validator: { response: 'zod' } },
    '@tanstack/react-query'
  ]
});
