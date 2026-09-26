export type DeleteBoardDialogProps = {
  open: boolean;
  title: string;
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};
