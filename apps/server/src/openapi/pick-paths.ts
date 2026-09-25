import type { OpenAPIObject } from '@nestjs/swagger';

import { isPlainObject, isString, pickBy } from 'remeda';

import type { PickPathsInput, ReachableSchemasInput } from './openapi.types';

import { OPENAPI } from './openapi.constants';

const collectRefs = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap(collectRefs);
  }

  if (!isPlainObject(value)) {
    return [];
  }

  return Object.entries(value).flatMap(([key, nested]) =>
    key === '$ref' && isString(nested) && nested.startsWith(OPENAPI.refPrefix) ? [nested.slice(OPENAPI.refPrefix.length)] : collectRefs(nested)
  );
};

const reachableSchemas = ({ schemas, paths }: ReachableSchemasInput): Set<string> => {
  const reached = new Set<string>();
  const pending = collectRefs(paths);

  while (pending.length > 0) {
    const name = pending.pop();

    if (name === undefined || reached.has(name)) {
      continue;
    }

    reached.add(name);
    pending.push(...collectRefs(schemas[name]));
  }

  return reached;
};

const tagsOf = (paths: OpenAPIObject['paths']): Set<string> =>
  new Set(
    Object.values(paths).flatMap((item) =>
      Object.values(item).flatMap((operation: unknown) =>
        isPlainObject(operation) && Array.isArray(operation.tags) ? operation.tags.filter(isString) : []
      )
    )
  );

export const pickPaths = ({ document, prefix }: PickPathsInput): OpenAPIObject => {
  const schemas = document.components?.schemas ?? {};
  const paths = pickBy(document.paths, (_item, path) => path.startsWith(prefix));
  const reached = reachableSchemas({ schemas, paths });
  const tags = tagsOf(paths);

  return {
    ...document,
    paths,
    tags: (document.tags ?? []).filter((tag) => tags.has(tag.name)),
    components: { ...document.components, schemas: pickBy(schemas, (_schema, name) => reached.has(name)) }
  };
};
