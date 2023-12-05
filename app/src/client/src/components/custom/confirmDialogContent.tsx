import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  dangerous?: boolean;
  onConfirm: () => void;
};

export default function ConfirmDialogContent({
  title,
  description,
  cancelText,
  confirmText,
  dangerous,
  onConfirm,
}: Props) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
        {description && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter className="flex-col">
        {dangerous ? (
          <>
            <AlertDialogAction asChild onClick={onConfirm}>
              <Button
                className="bg-red-500 hover:bg-red-600 hover:text-white"
                variant="destructive"
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
  );
}
