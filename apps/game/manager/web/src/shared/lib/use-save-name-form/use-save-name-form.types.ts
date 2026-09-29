export type UseSaveNameFormInput<View> = {
  maxLength: number;
  message: string;
  save: (name: string) => Promise<View>;
  onSaved: (view: View) => void;
};
