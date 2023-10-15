import { DataTable } from "@/components/ui/data-table";
import { Template, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { AddTemplateForm } from "./add";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useApiFetch } from "@/hooks/fetch";
import { useState, useRef, useEffect } from "react";
import ConfirmDialog from "@/components/custom/confirmDialog";
import { Row, Table as TableType } from "@tanstack/react-table";
import { BASE_URL } from "@/lib/constants";

export default function TemplatePage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Row<Template>[]>([]);
  const { data, loading, update, remove, create, get } = useCRUD<Template>({
    url: "/template",
    params: {
      page: page.toString(),
      limit: limit.toString(),
    },
  });

  useEffect(() => {
    get();
  }, [page, limit]);

  const apiFetch = useApiFetch();
  const tableRef = useRef<TableType<Template>>(null);

  const { data: types } = useCRUD<{
    value: string;
    label: string;
    replacements: string[];
    repetition: boolean;
  }>({
    url: "/template/types",
  });

  function deleteBatch() {
    apiFetch({
      url: `${BASE_URL}/template/batch?${
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
        <h1 className="inline-block text-xl font-semibold">Template</h1>
        <div className="space-x-4 space-y-2 -mt-2">
          <AddTemplateForm onSubmit={create} types={types || []}>
            <Button variant="outline" className="ml-4 mt-2">
              <PlusIcon className="mr-2" />
              Add
            </Button>
          </AddTemplateForm>
        {selectedRows?.length ? (
          <>
            <ConfirmDialog
              title={`Apakah Anda Yakin Untuk Menghapus ${selectedRows.length} Data Template?`}
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
        columns={columns(types || [])}
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
