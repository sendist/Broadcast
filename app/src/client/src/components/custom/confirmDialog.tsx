import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
      <AlertDialogContent>
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {dangerous ? (
            <>
              <AlertDialogAction asChild onClick={onConfirm}>
                <Button
                  className="bg-red-500 hover:bg-red-600 hover:text-white"
                  variant="ghost"
                >
                  {confirmText ?? "Continue"}
                </Button>
              </AlertDialogAction>
              <AlertDialogCancel>{cancelText ?? "Cancel"}</AlertDialogCancel>
            </>
          ) : (
            <>
              <AlertDialogCancel>{cancelText ?? "Cancel"}</AlertDialogCancel>
              <AlertDialogAction onClick={onConfirm}>
                {confirmText ?? "Continue"}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
