import { DataTable } from "@/components/ui/data-table";
import { Masjid, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { AddMasjidForm } from "./add";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { AddMasjidBulk } from "./bulk";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";
import { useState, useRef } from "react";
import ConfirmDialog from "@/components/custom/confirmDialog";
import { Row, Table as TableType } from "@tanstack/react-table";

export default function MasjidPage() {
  const [selectedRows, setSelectedRows] = useState<Row<Masjid>[]>([]);
  const { data, loading, update, remove, create, get } = useCRUD<Masjid>({
    url: "/masjid",
  });

  const apiFetch = useApiFetch();
  const tableRef = useRef<TableType<Masjid>>(null);

  function uploadTemplate(file: File) {
    apiFetch({
      url: `${BASE_URL}/masjid/upload`,
      options: {
        headers: {
          "Content-Type": file.type,
        },
        method: "POST",
        body: file,
      },
    }).then(() => {
      get();
    });
  }

  function deleteBatch() {
    apiFetch({
      url: `${BASE_URL}/masjid/batch?${
        new URLSearchParams({
          id: selectedRows.map((row) => row.original.id).join(","),
        }).toString() || ""
      }`,
      options: {
        method: "DELETE",
      },
    }).then(() => {
      get().then(() => {
        tableRef.current?.toggleAllPageRowsSelected(false);
      });
    });
  }

  return (
    <div>
    <div className="flex flex-row justify-between items-center mb-4">
      <h1 className="inline-block text-xl font-semibold">Masjid</h1>
      <div className="space-x-4">
        <AddMasjidForm onSubmit={create}>
          <Button variant="outline">
            <PlusIcon className="mr-2" />
            Add
          </Button>
        </AddMasjidForm>
        <AddMasjidBulk onSubmit={uploadTemplate}>
          <Button variant="outline">
            <PlusIcon className="mr-2" />
            Bulk Upload
          </Button>
        </AddMasjidBulk>
        {selectedRows?.length ? (
          <>
            <ConfirmDialog
              title={`Apakah Anda Yakin Untuk Menghapus ${selectedRows.length} Data Masjid?`}
              description="Data yang sudah dihapus tidak dapat dikembalikan"
              cancelText="Batal"
              confirmText="Hapus"
              onConfirm={deleteBatch}
              dangerous
            >
              <Button
                variant="outline"
                className="mb-4 text-red-600 hover:text-red-600 hover:bg-red-100"
              >
                <TrashIcon className="mr-2" />
                Delete Selected ({selectedRows?.length})
              </Button>
            </ConfirmDialog>
          </>
        ) : null}
      </div>
    </div>
      <DataTable
        ref={tableRef}
        columns={columns}
        data={data}
        isLoading={loading}
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
        onSelectedRowsChange={setSelectedRows}
      />
    </div>
  );
}
