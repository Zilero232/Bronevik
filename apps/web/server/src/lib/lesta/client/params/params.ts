import { z } from 'zod';

import type { CallParamsInput, FieldAwareSchemaInput, FieldList, LestaParams, LestaParamValue, Selected } from '../client.types';

import { LESTA_API } from '../client.constants';

const joinList = (value: FieldList | readonly (number | string)[] | undefined): string | undefined => {
  if (!value || value.length === 0) {
    return undefined;
  }

  return value.join(LESTA_API.listSeparator);
};

export const fieldsParam = (fields: FieldList | undefined): string | undefined => {
  if (fields && fields.length > LESTA_API.maxFields) {
    throw new RangeError(`Lesta accepts at most ${LESTA_API.maxFields} fields, got ${fields.length}`);
  }

  return joinList(fields);
};

export const callParams = ({ language, accessToken, extra, fields }: CallParamsInput): LestaParams => ({
  language,
  access_token: accessToken,
  extra: joinList(extra),
  fields: fieldsParam(fields)
});

const serializeValue = (value: LestaParamValue): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.length === 0 ? undefined : value.join(LESTA_API.listSeparator);
  }

  return String(value);
};

export const toSearchParams = (params: LestaParams): URLSearchParams => {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    const serialized = serializeValue(value);

    if (serialized !== undefined) {
      search.set(key, serialized);
    }
  }

  return search;
};

export const fieldAwareSchema = <T, F extends FieldList | undefined>({ schema, fields }: FieldAwareSchemaInput<T, F>) =>
  z.custom<Selected<F, T>>().superRefine((value, context) => {
    if (fields) {
      return;
    }

    const result = schema.safeParse(value);

    if (!result.success) {
      for (const issue of result.error.issues) {
        context.addIssue({ code: 'custom', message: issue.message, path: issue.path });
      }
    }
  });
