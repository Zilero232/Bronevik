import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: process.env.OTMETKI_OPENAPI_URL ?? './openapi/v1.json',
  output: { path: './src/generated', clean: true },
  parser: {
    transforms: {
      schemaName: (name) => name.replace(/^V1/, '').replace(/Dto(?:_(?:Output|Input))?$/, '')
    }
  },
  plugins: ['@hey-api/client-ky', '@hey-api/typescript', '@hey-api/sdk']
});
