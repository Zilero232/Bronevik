import { useTranslations } from 'next-intl';

import { Card, CardBody, CardHeader } from '@/ui-kit';

import type { CalcShellProps } from './CalcShell.types';

import s from './CalcShell.module.scss';

export const CalcShell = ({ title, description, inputs, results, footer }: CalcShellProps) => {
  const t = useTranslations('tools.shell');

  return (
    <div className={s.root}>
      <header className={s.head}>
        <h2 className={s.title}>{title}</h2>
        {description && <p className={s.description}>{description}</p>}
      </header>
      <div className={s.panels}>
        <Card padding='none'>
          <CardHeader title={t('inputs')} />
          <CardBody className={s.inputs}>{inputs}</CardBody>
        </Card>
        <Card aria-live='polite' padding='none'>
          <CardHeader title={t('results')} />
          <CardBody className={s.results}>{results}</CardBody>
        </Card>
      </div>
      {footer && <p className={s.footer}>{footer}</p>}
    </div>
  );
};
