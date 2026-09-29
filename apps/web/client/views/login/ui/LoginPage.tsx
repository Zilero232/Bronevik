'use client';

import { useLoginError } from '../model/hooks';
import { LoginBenefits, LoginOptions } from './components';

import s from './LoginPage.module.scss';

export const LoginPage = () => {
  const error = useLoginError();

  return (
    <div className={s.root}>
      <LoginOptions error={error} />
      <LoginBenefits />
    </div>
  );
};
