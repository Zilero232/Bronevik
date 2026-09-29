import { toast } from 'sonner';

import { useErrorText } from '../use-error-text';

export const useErrorToast = () => {
  const errorText = useErrorText();

  return (error: unknown) => {
    const { title, hint } = errorText(error);

    toast.error(title, { description: hint });
  };
};
