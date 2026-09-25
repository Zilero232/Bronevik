import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

export type PromoFieldProps = {
  registration: UseFormRegisterReturn<'promoCode'>;
  error?: FieldError;
};
