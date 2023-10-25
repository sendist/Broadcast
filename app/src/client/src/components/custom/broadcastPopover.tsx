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
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { useState } from "react";

export type PreviewTextType = { message: string; recipients: string[] };

const months = [
  { value: "0", label: "Januari" },
  { value: "1", label: "Februari" },
  { value: "2", label: "Maret" },
  { value: "3", label: "April" },
  { value: "4", label: "Mei" },
  { value: "5", label: "Juni" },
  { value: "6", label: "Juli" },
  { value: "7", label: "Agustus" },
  { value: "8", label: "September" },
  { value: "9", label: "Oktober" },
  { value: "10", label: "November" },
  { value: "11", label: "Desember" },
] as const;

type Props = {
  children: React.ReactNode;
  select: {
    label: string;
    value: string;
  }[];
  bulanan?: boolean;
  refreshPreview: ({
    idTemplateDKM,
    idTemplateMubaligh,
  }: {
    idTemplateDKM?: string;
    idTemplateMubaligh?: string;
  }) => void;
  previewTexts: PreviewTextType[];
  onSend: ({
    idTemplateDKM,
    idTemplateMubaligh,
  }: {
    idTemplateDKM?: string;
    idTemplateMubaligh?: string;
  }) => void;
};

export function BroadcastPopover({
  children,
  select,
  bulanan,
  refreshPreview,
  previewTexts,
  onSend,
}: Props) {
  const [idTemplateDKM, setIdTemplateDKM] = useState<string>("");
  const [idTemplateMubaligh, setIdTemplateMubaligh] = useState<string>("");
  const [DKMActive, setDKMActive] = useState<boolean>(true);
  const [MubalighActive, setMubalighActive] = useState<boolean>(true);
  const [month, setMonth] = useState<string>(new Date().getMonth().toString());

  const updateTemplates = ({
    idTemplateDKM: newIdTemplateDKM,
    idTemplateMubaligh: newIdTemplateMubaligh,
    DKMActive: newDKMActive,
    MubalighActive: newMubalighActive,
  }: {
    idTemplateDKM?: string;
    idTemplateMubaligh?: string;
    DKMActive?: boolean;
    MubalighActive?: boolean;
  }) => {
    if (newIdTemplateDKM !== undefined) {
      setIdTemplateDKM(newIdTemplateDKM);
      ((DKMActive && newIdTemplateDKM) ||
        (MubalighActive && idTemplateMubaligh)) &&
        refreshPreview({
          idTemplateDKM: DKMActive ? newIdTemplateDKM : undefined,
          idTemplateMubaligh: MubalighActive ? idTemplateMubaligh : undefined,
          ...(bulanan && { month: month }),
        });
    }
    if (newIdTemplateMubaligh !== undefined) {
      setIdTemplateMubaligh(newIdTemplateMubaligh);
      ((DKMActive && idTemplateDKM) ||
        (MubalighActive && newIdTemplateMubaligh)) &&
        refreshPreview({
          idTemplateDKM: DKMActive ? idTemplateDKM : undefined,
          idTemplateMubaligh: MubalighActive
            ? newIdTemplateMubaligh
            : undefined,
          ...(bulanan && { month: month }),
        });
    }
    if (newDKMActive !== undefined) {
      setDKMActive(newDKMActive);
      ((newDKMActive && idTemplateDKM) ||
        (MubalighActive && idTemplateMubaligh)) &&
        refreshPreview({
          idTemplateDKM: newDKMActive ? idTemplateDKM : undefined,
          idTemplateMubaligh: MubalighActive ? idTemplateMubaligh : undefined,
          ...(bulanan && { month: month }),
        });
    }
    if (newMubalighActive !== undefined) {
      setMubalighActive(newMubalighActive);
      ((DKMActive && idTemplateDKM) ||
        (newMubalighActive && idTemplateMubaligh)) &&
        refreshPreview({
          idTemplateDKM: DKMActive ? idTemplateDKM : undefined,
          idTemplateMubaligh: newMubalighActive
            ? idTemplateMubaligh
            : undefined,
          ...(bulanan && { month: month }),
        });
    }
  };

  function changeMonth(newMonth: string) {
    setMonth(newMonth);
    ((DKMActive && idTemplateDKM) || (MubalighActive && idTemplateMubaligh)) &&
      refreshPreview({
        idTemplateDKM: DKMActive ? idTemplateDKM : undefined,
        idTemplateMubaligh: MubalighActive ? idTemplateMubaligh : undefined,
        ...(bulanan && { month: newMonth }),
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Broadcast</DialogTitle>
          <DialogDescription>Kirimkan pesan secara langsung</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:w-full">
            <div className="flex flex-col gap-1">
              <span className="flex flex-row gap-1 items-center">
                <Checkbox
                  checked={DKMActive}
                  onCheckedChange={(checked) =>
                    updateTemplates({
                      DKMActive: !!checked,
                    })
                  }
                />
                <Label>Ketua DKM</Label>
              </span>
              <InputDropdown
                select={select}
                value={idTemplateDKM}
                onChange={(id) =>
                  updateTemplates({
                    idTemplateDKM: id,
                  })
                }
                placeholder="Pilih Template..."
                disabled={!DKMActive}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex flex-row gap-1 items-center">
                <Checkbox
                  checked={MubalighActive}
                  onCheckedChange={(checked) =>
                    updateTemplates({ MubalighActive: !!checked })
                  }
                />
                <Label>Mubaligh</Label>
              </span>
              <InputDropdown
                select={select}
                value={idTemplateMubaligh}
                onChange={(id) => updateTemplates({ idTemplateMubaligh: id })}
                placeholder="Pilih Template..."
                disabled={!MubalighActive}
              />
            </div>
          </div>
          {bulanan && (
            <div className="flex flex-col mt-4 gap-1">
              <Label>Bulan</Label>
              <InputDropdown
                select={months}
                value={month}
                onChange={changeMonth}
                placeholder="Pilih Bulan..."
              />
            </div>
          )}
        </div>
        <Separator />
        <div className="min-h-[200px] max-h-[400px]">
          <ScrollArea className="p-2 max-h-[400px]">
            {previewTexts.length
              ? previewTexts.map((previewText, i) => (
                  <div
                    className="flex items-end flex-col gap-1"
                    key={previewText.message + i}
                  >
                    <p className="text-sm">
                      {previewText.recipients.join(", ")}
                    </p>
                    <div className="flex justify-end">
                      <div className="single-message rounded-tl-lg rounded-bl-lg text-[#111b21] rounded-br-lg user mb-4 px-4 py-2 bg-[#d9fdd3] text-sm">
                        {whatsappFormatting(previewText.message)}
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
                  </div>
                ))
              : null}
          </ScrollArea>
        </div>
        <DialogClose asChild>
          <Button
            disabled={
              !(
                (DKMActive && idTemplateDKM) ||
                (MubalighActive && idTemplateMubaligh)
              )
            }
            onClick={() =>
              onSend({
                idTemplateDKM: DKMActive ? idTemplateDKM : undefined,
                idTemplateMubaligh: MubalighActive
                  ? idTemplateMubaligh
                  : undefined,
                ...(bulanan && { month: month }),
              })
            }
          >
            Kirim
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
