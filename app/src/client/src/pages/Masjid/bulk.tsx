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

export function AddMasjidBulk({
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
      url: `${BASE_URL}/masjid/template`,
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
          <DialogDescription>Input data masjid secara banyak</DialogDescription>
        </DialogHeader>
        <p>Step 1. Download File Template</p>
        <Button onClick={downloadTemplate}>Download Template</Button>
        <p>Step 2. Upload</p>
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
