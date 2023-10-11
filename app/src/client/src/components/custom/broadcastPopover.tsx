import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import InputDropdown from "./inputDropdown";
import { Button } from "../ui/button";
import { whatsappFormatting } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  select: {
    label: string;
    value: string;
  }[];
  idTemplate: string;
  setIdTemplate: (id: string) => void;
  previewTexts: string[];
  onSend: () => void;
};

export function BroadcastPopover({
  children,
  select,
  idTemplate,
  setIdTemplate,
  previewTexts,
  onSend,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Broadcast</DialogTitle>
          <DialogDescription>Kirimkan pesan secara langsung</DialogDescription>
        </DialogHeader>
        <InputDropdown
          select={select}
          value={idTemplate}
          onChange={setIdTemplate}
          placeholder="Pilih Template..."
        />
        <div className="min-h-[200px]">
          {previewTexts &&
            previewTexts.map((previewText) => (
              <div className="flex justify-end">
                <div className="single-message rounded-tl-lg rounded-bl-lg text-[#111b21] rounded-br-lg user mb-4 px-4 py-2 bg-[#d9fdd3]">
                  <span className="whitespace-pre-wrap">
                    {whatsappFormatting(previewText)}
                  </span>
                </div>
                <span>
                  <svg
                    className="user-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 8 13"
                    width="8"
                    height="13"
                  >
                    <path
                      opacity=".13"
                      d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"
                    ></path>
                    <path
                      fill="#d9fdd3"
                      d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"
                    ></path>
                  </svg>
                </span>
              </div>
            ))}
        </div>
        <DialogClose asChild>
          <Button disabled={!idTemplate} onClick={onSend}>
            Kirim
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
