import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";

export function AddJadwalPengajianBulk({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (file: File) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const apiFetch = useApiFetch();

  function downloadTemplate() {
    apiFetch({
      url: `${BASE_URL}/jadwal-pengajian/template`,
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Data Bulk</DialogTitle>
          <DialogDescription>Input data jadwal pengajian secara kolektif</DialogDescription>
        </DialogHeader>
        <p>Step 1. Download File Template berikut terlebih dahulu.</p>
        <Button onClick={downloadTemplate}>Download Template</Button>
        <p>Step 2. Setelah didownload, edit file excel tadi di perangkat Anda.</p>
        <p>Step 3. Upload file yang sudah Anda edit pada bagian di bawah ini:</p>
        <Input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <DialogClose asChild>
          <Button
            disabled={!file}
            onClick={() => {
              file && onSubmit(file);
              setFile(undefined);
            }}
          >
            Submit
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
