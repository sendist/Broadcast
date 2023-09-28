import { DataTable } from "@/components/ui/data-table";
import { Masjid, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";

const InputDialog = ({
  onSubmit,
}: {
  onSubmit: ({
    nama_masjid,
    nama_ketua_dkm,
    no_hp,
  }: {
    nama_masjid: string;
    nama_ketua_dkm: string;
    no_hp: string;
  }) => void;
}) => {
  const [namaMasjid, setNamaMasjid] = useState("");
  const [namaKetuaDkm, setNamaKetuaDkm] = useState("");
  const [noHp, setNoHp] = useState("");

  function submit() {
    // check if all fields are filled
    if (!namaMasjid || !namaKetuaDkm || !noHp) {
      return;
    }
    onSubmit({
      nama_masjid: namaMasjid,
      nama_ketua_dkm: namaKetuaDkm,
      no_hp: noHp,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4">
          <PlusIcon className="mr-2" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Data Masjid</DialogTitle>
          <DialogDescription>
            Input data masjid yang akan ditambahkan
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama_masjid" className="text-right">
              Nama Masjid
            </Label>
            <Input
              id="nama_masjid"
              placeholder="Nama Masjid"
              className="col-span-3"
              value={namaMasjid}
              onChange={(e) => setNamaMasjid(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama_ketua_dkm" className="text-right">
              Ketua DKM
            </Label>
            <Input
              id="nama_ketua_dkm"
              placeholder="Nama Ketua DKM"
              className="col-span-3"
              value={namaKetuaDkm}
              onChange={(e) => setNamaKetuaDkm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="no_hp" className="text-right">
              No. HP
            </Label>
            <Input
              id="no_hp"
              placeholder="08xxxxxx"
              className="col-span-3"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-4"></div>
        <DialogFooter>
          <Button type="submit" onClick={submit}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function Masjid() {
  const { data, loading, update, remove, create } = useCRUD<Masjid>({
    url: "/masjid",
  });

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : data ? (
        <>
          <InputDialog onSubmit={create} />
          <DataTable
            columns={columns}
            data={data}
            meta={{
              updateData: (id: string, key: string, value: unknown) => {
                update(id, {
                  [key]: value,
                });
              },
              removeData: (id: string) => {
                remove(id);
              },
            }}
          />
        </>
      ) : (
        <div>No data</div>
      )}
    </div>
  );
}
