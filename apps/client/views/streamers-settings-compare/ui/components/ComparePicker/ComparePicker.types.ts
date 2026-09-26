import type { SelectItem } from '@/ui-kit';

export type ComparePickerProps = {
  picked: { slug: string; label: string }[];
  addItems: SelectItem[];
  canAdd: boolean;
  isMine: boolean;
  isSignedIn: boolean;
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
  onMineChange: (value: boolean) => void;
};
