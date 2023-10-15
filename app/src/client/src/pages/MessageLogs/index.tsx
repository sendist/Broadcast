import { DataTable } from "@/components/ui/data-table";
import { MessageLog, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";
import { useState, useRef } from "react";
import ConfirmDialog from "@/components/custom/confirmDialog";
import { Row, Table as TableType } from "@tanstack/react-table";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export default function MessageLogs() {
  const [selectedRows, setSelectedRows] = useState<Row<Masjid>[]>([]);
  const { data, loading, remove, get } = useCRUD<MessageLog>({
    url: "/message-logs",
    params: {
      orderBy: "send_time",
      orderType: "desc",
    },
  });
  const apiFetch = useApiFetch();
  const tableRef = useRef<TableType<MessageLog>>(null);

  function deleteBatch() {
    apiFetch({
      url: `${BASE_URL}/message-logs/batch?${
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
    <>
      <h1 className="inline-block text-xl font-semibold mb-4">Message Logs</h1>
      <div>
        <div className="space-x-4">
        {selectedRows?.length ? (
          <>
            <ConfirmDialog
              title={`Apakah Anda Yakin Untuk Menghapus ${selectedRows.length} Data Log?`}
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
        <DataTable
        ref={tableRef}
          columns={columns}
          data={data}
          isLoading={loading}
          meta={{
            removeData: (id: string) => {
              remove(id);
            },
            resend: (id: string) => {
              apiFetch({
                url: `${BASE_URL}/message-logs/resend/${id}`,
              });
            },
          }}
        onSelectedRowsChange={setSelectedRows}
        />
      </div>
    </>
  );
}
