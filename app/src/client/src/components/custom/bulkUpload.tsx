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
import LoadingIcon from "@/assets/loadingIcon";

type Props = {
  title: string;
  description: string;
  templateUrl: string;
  children: React.ReactNode;
  onSubmitFile: (file: File) => void;
};

export default function BulkUpload({
  title,
  description,
  templateUrl,
  children,
  onSubmitFile,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const apiFetch = useApiFetch();
  const [downloadTemplateLoading, setDownloadTemplateLoading] = useState(false);

  function downloadTemplate() {
    setDownloadTemplateLoading(true);
    apiFetch({
      url: templateUrl,
    }).then(() => {
      setDownloadTemplateLoading(false);
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ol className="relative border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
              1
            </span>
            <h3 className="font-medium leading-tight">Download Template</h3>
            <p className="text-sm text-muted-foreground">
              Download File template berupa Excel
            </p>
            <Button
              className="mt-2"
              onClick={downloadTemplate}
              disabled={downloadTemplateLoading}
            >
              {downloadTemplateLoading ? (
                <>
                  <LoadingIcon /> Generating Template...
                </>
              ) : (
                "Download Template"
              )}
            </Button>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
              2
            </span>
            <h3 className="font-medium leading-tight">Edit File</h3>
            <p className="text-sm text-muted-foreground">
              Setelah didownload, edit file excel tersebut di perangkat Anda.
              Anda dapat menutup dialog ini dan menguploadnya kapan saja.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
              3
            </span>
            <h3 className="font-medium leading-tight">Upload File</h3>
            <p className="text-sm text-muted-foreground">
              Upload file yang sudah Anda edit
            </p>
            <div className="mt-2 flex flex-row gap-2">
              <Input
                type="file"
                accept=".xlsx"
                onChange={(e) => setFile(e.target.files?.[0])}
              />
              <DialogClose asChild>
                <Button
                  disabled={!file}
                  onClick={() => {
                    file && onSubmitFile(file);
                    setFile(undefined);
                  }}
                >
                  Upload
                </Button>
              </DialogClose>
            </div>
          </li>
        </ol>
      </DialogContent>
    </Dialog>
  );
}
