import { Select } from '@/ui-kit';

import { useAccountSelect } from '../model/hooks';

export const AccountSelect = () => {
  const { label, options, value, isPending, onChange } = useAccountSelect();

  return <Select aria-label={label} disabled={isPending} options={options} value={value} onChange={(event) => onChange(event.target.value)} />;
};
