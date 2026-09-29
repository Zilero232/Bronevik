import { useTranslations } from 'use-intl';

import { HELP_FAQ } from '../../../config';

export const useHelpView = () => {
  const t = useTranslations('help.faq');

  return {
    faq: HELP_FAQ.map((id) => ({ id, title: t(`${id}.question`), content: t(`${id}.answer`) }))
  };
};
