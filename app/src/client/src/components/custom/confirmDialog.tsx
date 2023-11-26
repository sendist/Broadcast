import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ConfirmDialogContent from "./confirmDialogContent";

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  dangerous?: boolean;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  children,
  title,
  description,
  cancelText,
  confirmText,
  dangerous,
  onConfirm,
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <ConfirmDialogContent
        title={title}
        description={description}
        onConfirm={onConfirm}
        cancelText={cancelText}
        confirmText={confirmText}
        dangerous={dangerous}
      />
    </AlertDialog>
  );
}
