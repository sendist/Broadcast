import { DataTable } from "@/components/ui/data-table";
import { MessageLog, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";
import { useState, useRef, useEffect } from "react";
import ConfirmDialog from "@/components/custom/confirmDialog";
import { Row, Table as TableType } from "@tanstack/react-table";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const limit = 20;

export default function MessageLogs() {
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Row<MessageLog>[]>([]);
  const { data, loading, remove, get } = useCRUD<MessageLog>({
    url: "/message-logs",
    params: {
      orderBy: "send_time",
      orderType: "desc",
      page: page.toString(),
      limit: limit.toString(),
    },
  });

  useEffect(() => {
    get();
    // eslint-disable-next-line
  }, [page]);

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
    <div>
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="inline-block text-xl font-semibold mt-2">
          Message Logs
        </h1>
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
        limit={limit}
        meta={{
          previousPage: () => {
            if (page > 1) {
              setPage(page - 1);
            }
          },
          nextPage: () => {
            setPage(page + 1);
          },
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
  );
}
