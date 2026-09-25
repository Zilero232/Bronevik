'use client';

import { useTranslations } from 'next-intl';

import { env } from '@/shared/config';
import { Badge, CodeBlock } from '@/ui-kit';

import type { EndpointDetailsProps } from './EndpointDetails.types';

import { buildCurlExample } from '../../../../../lib/curl-example';

import s from './EndpointDetails.module.scss';

export const EndpointDetails = ({ endpoint }: EndpointDetailsProps) => {
  const t = useTranslations('developers.explorer');

  const { method, path, parameters, responses, operationId } = endpoint;
  const curl = buildCurlExample({ baseUrl: env.NEXT_PUBLIC_API_URL, method, path, parameters });

  return (
    <div className={s.root}>
      <div className={s.meta}>
        <h4 className={s.heading}>{t('params.title')}</h4>
        {parameters.length === 0 && <p className={s.none}>{t('params.none')}</p>}
        {parameters.length > 0 && (
          <table className={s.table}>
            <thead>
              <tr>
                <th scope='col'>{t('params.name')}</th>
                <th scope='col'>{t('params.in')}</th>
                <th scope='col'>{t('params.type')}</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map(({ name, in: location, required, schema, description }) => (
                <tr key={`${location}:${name}`}>
                  <td>
                    <code className={s.name}>{name}</code>
                    {required && <span className={s.required}>{t('params.required')}</span>}
                    {description && <span className={s.description}>{description}</span>}
                  </td>
                  <td className={s.location}>{location}</td>
                  <td className={s.type}>{schema?.enum ? schema.enum.map(String).join(' | ') : (schema?.type ?? '—')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {responses.length > 0 && (
          <>
            <h4 className={s.heading}>{t('responses')}</h4>
            <ul className={s.responses}>
              {responses.map(({ status, description }) => (
                <li key={status} className={s.response}>
                  <Badge tone={status.startsWith('2') ? 'success' : 'warning'}>{status}</Badge>
                  <span>{description ?? t('ok')}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <CodeBlock className={s.curl} code={curl} language='bash' title={operationId ?? t('curl')} />
    </div>
  );
};
