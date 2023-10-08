import InputDropdown from "@/components/custom/inputDropdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";

type Props = {
  idJadwal: string;
  children: React.ReactNode;
  template: {
    id: string;
    content: string;
    nama_template: string;
  }[];
};

export default function Broadcast({ idJadwal, children, template }: Props) {
  const [idTemplate, setIdTemplate] = useState<string>("");
  const apiFetch = useApiFetch();
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Broadcast</DialogTitle>
          <DialogDescription>Kirimkan pesan secara langsung</DialogDescription>
        </DialogHeader>
        <InputDropdown
          select={template.map((item) => ({
            label: item.nama_template,
            value: item.id,
          }))}
          value={idTemplate}
          onChange={setIdTemplate}
          placeholder="Pilih Template..."
        />
        <p>{template.find((item) => item.id === idTemplate)?.content || ""}</p>
        <DialogClose asChild>
          <Button
            disabled={!idTemplate}
            onClick={() =>
              apiFetch({
                url:
                  BASE_URL +
                  "/jadwal-pengajian/broadcast?" +
                  new URLSearchParams({
                    id: idJadwal,
                    template: idTemplate,
                  }).toString(),
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
