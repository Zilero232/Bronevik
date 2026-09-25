'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { env } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { REVEAL_VIEWPORT, STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { CodeBlock, CopyField, SectionHeader, Tabs } from '@/ui-kit';

import { quickstartSamples } from '../../../lib/code-samples';
import { trimBaseUrl } from '../../../lib/curl-example';

import s from './Quickstart.module.scss';

const STEPS = ['key', 'install', 'request'] as const;
const BASE_URL = trimBaseUrl(env.NEXT_PUBLIC_API_URL);
const SAMPLES = quickstartSamples(BASE_URL);

export const Quickstart = () => {
  const t = useTranslations('developers.quickstart');

  return (
    <section className={s.root} id='quickstart'>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='02' title={t('title')} />
      <div className={s.layout}>
        <motion.ol className={s.steps} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
          {STEPS.map((step, index) => (
            <motion.li key={step} className={s.step} variants={STAGGER_ITEM}>
              <span className={s.number}>{String(index + 1).padStart(2, '0')}</span>
              <div className={s.stepBody}>
                <h3 className={s.stepTitle}>{t(`steps.${step}.title`)}</h3>
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
              </div>
            </motion.li>
          ))}
          <motion.li className={s.base} variants={STAGGER_ITEM}>
            <CopyField label={t('baseUrl')} tone='accent' value={BASE_URL} />
          </motion.li>
        </motion.ol>
        <Tabs
          items={SAMPLES.map(({ id, language, code }) => ({
            value: id,
            label: t(`tabs.${id}`),
            content: <CodeBlock code={code} language={language} title={t(`files.${id}`)} />
          }))}
          className={s.tabs}
        />
      </div>
    </section>
  );
};
