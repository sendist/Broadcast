import { DataTable } from "@/components/ui/data-table";
import { Table as TableType, Row } from "@tanstack/react-table";
import { JadwalJumatan, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { AddJadwalJumatanForm } from "./add";
import { Button } from "@/components/ui/button";
import { PlusIcon, RocketIcon, TrashIcon } from "@radix-ui/react-icons";
import { AddJadwalJumatanBulk } from "./bulk";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";
import ConfirmDialog from "../../components/custom/confirmDialog";
import { useRef, useState } from "react";
import Broadcast from "./broadcast";

export default function JadwalMasjidPage() {
  const [selectedRows, setSelectedRows] = useState<Row<JadwalJumatan>[]>([]);
  const { data, loading, update, remove, create, get } = useCRUD<JadwalJumatan>(
    {
      url: "/jadwal-jumatan",
    }
  );

  const { data: masjidForDropdown } = useCRUD<{
    id: string;
    nama_masjid: string;
  }>({
    url: "/masjid",
    params: {
      fields: "id,nama_masjid",
    },
  });
  const { data: mubalighForDropdown } = useCRUD<{
    id: string;
    nama_mubaligh: string;
  }>({
    url: "/mubaligh",
    params: {
      fields: "id,nama_mubaligh",
    },
  });
  const { data: template } = useCRUD<{
    id: string;
    content: string;
    nama_template: string;
  }>({
    url: "/template",
    params: {
      fields: "id,content,nama_template",
      type: "jumatan_reminder",
    },
  });

  const masjidDropdown = masjidForDropdown?.map((item) => ({
    label: item.nama_masjid,
    value: item.id,
  }));
  const mubalighDropdown = mubalighForDropdown?.map((item) => ({
    label: item.nama_mubaligh,
    value: item.id,
  }));

  const apiFetch = useApiFetch();
  const tableRef = useRef<TableType<JadwalJumatan>>(null);

  function uploadTemplate(file: File) {
    apiFetch({
      url: `${BASE_URL}/jadwal-jumatan/upload`,
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
      url: `${BASE_URL}/jadwal-jumatan/batch?${
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
        <h1 className="inline-block text-xl font-semibold">Jumatan</h1>
        <div className="space-x-4">
          <AddJadwalJumatanForm
            onSubmit={create}
            mubalighDropdown={mubalighDropdown || []}
            masjidDropdown={masjidDropdown || []}
          >
            <Button variant="outline">
              <PlusIcon className="mr-2" />
              Add
            </Button>
          </AddJadwalJumatanForm>
          <AddJadwalJumatanBulk onSubmit={uploadTemplate}>
            <Button variant="outline">
              <PlusIcon className="mr-2" />
              Bulk Upload
            </Button>
          </AddJadwalJumatanBulk>
          {selectedRows?.length ? (
            <>
              <ConfirmDialog
                title={`Apakah Anda Yakin Untuk Menghapus ${selectedRows.length} Jadwal Jumatan?`}
                description="Data yang sudah dihapus tidak dapat dikembalikan"
                cancelText="Batal"
                confirmText="Hapus"
                onConfirm={deleteBatch}
                dangerous
              >
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-600 hover:bg-red-100"
                >
                  <TrashIcon className="mr-2" />
                  Delete Selected ({selectedRows?.length})
                </Button>
              </ConfirmDialog>
              <Broadcast
                template={template || []}
                idJadwal={selectedRows.map((row) => row.original.id)}
              >
                <Button variant="outline">
                  <RocketIcon className="mr-2" />
                  Broadcast Selected ({selectedRows?.length})
                </Button>
              </Broadcast>
            </>
          ) : null}
        </div>
      </div>
      <DataTable
        ref={tableRef}
        columns={columns(
          masjidDropdown || [],
          mubalighDropdown || [],
          template || []
        )}
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
