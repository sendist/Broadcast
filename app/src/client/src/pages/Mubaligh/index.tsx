import { DataTable } from "@/components/ui/data-table";
import { Mubaligh, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { AddMubalighForm } from "./add";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { AddMubalighBulk } from "./bulk";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";
import { useState, useRef, useEffect } from "react";
import ConfirmDialog from "@/components/custom/confirmDialog";
import { Row, Table as TableType } from "@tanstack/react-table";

export default function MubalighPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Row<Mubaligh>[]>([]);
  const { data, loading, update, remove, create, get } = useCRUD<Mubaligh>({
    url: "/mubaligh",
    params: {
      page: page.toString(),
      limit: limit.toString(),
    },
  });

  useEffect(() => {
    get();
  }, [page, limit]);

  const apiFetch = useApiFetch();
  const tableRef = useRef<TableType<Mubaligh>>(null);

  function uploadTemplate(file: File) {
    apiFetch({
      url: `${BASE_URL}/mubaligh/upload`,
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
      url: `${BASE_URL}/mubaligh/batch?${
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
        <h1 className="inline-block text-xl font-semibold">Mubaligh</h1>
        <div className="space-x-4 space-y-2 -mt-2">
          <AddMubalighForm onSubmit={create}>
            <Button variant="outline" className="ml-4 mt-2">
              <PlusIcon className="mr-2" />
              Add
            </Button>
          </AddMubalighForm>
          <AddMubalighBulk onSubmit={uploadTemplate}>
            <Button variant="outline">
              <PlusIcon className="mr-2" />
              Bulk Upload
            </Button>
          </AddMubalighBulk>
        {selectedRows?.length ? (
          <>
            <ConfirmDialog
              title={`Apakah Anda Yakin Untuk Menghapus ${selectedRows.length} Data Mubaligh?`}
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
          </>
        ) : null}
        </div>
      </div>
      <DataTable
        ref={tableRef}
        columns={columns}
        data={data}
        isLoading={loading}
        page={page}
        meta={{
          previousPage: () => {
            if (page > 1) {
              setPage(page - 1);
            }
          },
          nextPage: () => {
            setPage(page + 1);
          },
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
