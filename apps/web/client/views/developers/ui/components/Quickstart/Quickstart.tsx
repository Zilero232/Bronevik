'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Card, CardBody, CardHeader, CodeBlock, CopyField, Tabs } from '@/ui-kit';

import { QUICKSTART } from '../../../config';

import s from './Quickstart.module.scss';

export const Quickstart = () => {
  const t = useTranslations('developers.quickstart');

  return (
    <Card id='quickstart'>
      <CardHeader title={t('title')}>
        <p className={s.description}>{t('description')}</p>
      </CardHeader>
      <CardBody>
        <div className={s.layout}>
          <div className={s.aside}>
            <ol className={s.steps}>
              {QUICKSTART.steps.map((step) => (
                <li key={step} className={s.step}>
                  <h4 className={s.stepTitle}>{t(`steps.${step}.title`)}</h4>
                  <p className={s.stepText}>
                    {t.rich(`steps.${step}.text`, {
                      link: (chunks) => (
                        <Link className={s.link} href={ROUTES.account.developer}>
                          {chunks}
                        </Link>
                      ),
                      code: (chunks) => <code className={s.inline}>{chunks}</code>
                    })}
                  </p>
                </li>
              ))}
            </ol>
            <CopyField label={t('baseUrl')} tone='neutral' value={QUICKSTART.baseUrl} />
          </div>
          <Tabs
            items={QUICKSTART.samples.map(({ id, language, code }) => ({
              value: id,
              label: t(`tabs.${id}`),
              content: <CodeBlock code={code} language={language} title={t(`files.${id}`)} />
            }))}
            className={s.tabs}
          />
        </div>
      </CardBody>
    </Card>
  );
};
