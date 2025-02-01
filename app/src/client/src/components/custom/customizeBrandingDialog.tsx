import Logo from "@/assets/logo";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import ConfirmDialogContent from "./confirmDialogContent";
import useCustomization from "@/hooks/customization";
import { useEffect, useState } from "react";
import RightArrowIcon from "@/assets/rightArrowIcon";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";

const CustomizeBrandingDialog = () => {
  const { appName, appLogo, setAppName, setAppLogo } = useCustomization();

  const [updateName, setUpdateName] = useState(appName);
  const [file, setFile] = useState<File | undefined>(undefined);
  const apiFetch = useApiFetch();

  useEffect(() => {
    setUpdateName(appName);
  }, [appName]);

  function resetBranding() {
    apiFetch<string>({
      url: `${BASE_URL}/rebrand/logo`,
      options: {
        method: "DELETE",
      },
    }).then((res) => {
      if (res?.error) {
        console.log(res.error);
        return;
      }
      setAppLogo(res!.data!);
    });
  }

  function updateBranding() {
    if (updateName !== appName) {
      apiFetch<string>({
        url: `${BASE_URL}/rebrand/name`,
        options: {
          method: "POST",
          body: JSON.stringify({ name: updateName || "Broadcast" }),
        },
      }).then((res) => {
        if (res?.error) {
          console.log(res.error);
          return;
        }
        setAppName(res!.data!);
      });
    }

    if (file) {
      apiFetch<string>({
        url: `${BASE_URL}/rebrand/logo`,
        options: {
          method: "POST",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        },
      }).then((res) => {
        if (res?.error) {
          console.log(res.error);
          return;
        }
        setFile(undefined);
        setAppLogo(res!.data!);
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="mt-4">
          Customize Branding
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Branding</DialogTitle>
          <DialogDescription>
            Kustomisasi branding sesuai dengan branding Anda
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row items-center justify-between border p-4 rounded-lg">
          <p className="text-sm font-medium">Nama</p>
          <Input
            className="w-60"
            placeholder="Broadcast"
            value={updateName}
            onChange={(e) => setUpdateName(e.target.value)}
          />
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-sm font-medium">Logo</p>
          <div className="grid place-items-center">
            {file ? (
              <div className="flex flex-row items-center gap-4">
                <Logo src={appLogo} className="w-32 h-32" />
                <RightArrowIcon />
                <Logo src={URL.createObjectURL(file)} className="w-32 h-32" />
              </div>
            ) : (
              <Logo
                src={file ? URL.createObjectURL(file) : appLogo}
                className="w-52 h-52"
              />
            )}
            <div className="flex flex-row gap-4 mt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Reset</Button>
                </AlertDialogTrigger>
                <ConfirmDialogContent
                  title="Reset Logo"
                  description="Apakah Anda yakin ingin menghapus logo dan mereset menjadi semula?"
                  cancelText="Batal"
                  confirmText="Reset"
                  onConfirm={() => {
                    resetBranding();
                  }}
                  dangerous
                />
              </AlertDialog>
              <Input
                className="w-60 cursor-pointer"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  console.log(e.target.files?.[0].type);
                  setFile(e.target.files?.[0]);
                }}
              />
            </div>
          </div>
        </div>
        <Button
          disabled={updateName === appName && !file}
          onClick={() => {
            updateBranding();
          }}
        >
          Simpan
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizeBrandingDialog;
