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
import { Row, SortingState, Table as TableType } from "@tanstack/react-table";
import { SearchBar } from "@/components/ui/search-bar";
import useFirstRender from "@/hooks/firstRender";

const limit = 20;

export default function MubalighPage() {
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Row<Mubaligh>[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchText, setSearchText] = useState("");
  const { data, loading, update, remove, create, get } = useCRUD<Mubaligh>({
    url: "/mubaligh",
    params: {
      page: page.toString(),
      limit: limit.toString(),
      ...(sorting[0] && {
        orderBy: sorting[0].id,
        orderType: sorting[0].desc ? "desc" : "asc",
      }),
      ...(searchText && {
        search: searchText,
      }),
    },
  });

  const apiFetch = useApiFetch();
  const tableRef = useRef<TableType<Mubaligh>>(null);
  const isFirstRender = useFirstRender();

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

  useEffect(() => {
    setPage(1);
  }, [searchText]);

  useEffect(() => {
    if (!isFirstRender) {
      get();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sorting, searchText]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4  items-start gap-4 sm:gap-0">
        <div>
          <h1 className="inline-block text-xl font-semibold">Mubaligh</h1>
          <p className="text-sm text-muted-foreground">Atur Daftar Mubaligh</p>
        </div>
        <div className="flex items-center space-x-4">
          <SearchBar
            value={searchText}
            onChange={(newValue) => setSearchText(newValue)}
            placeholder="Cari Mubaligh"
          />
          <AddMubalighForm onSubmit={create}>
            <Button variant="white" className="ml-4">
              <PlusIcon className="mr-2" />
              Add
            </Button>
          </AddMubalighForm>
          <AddMubalighBulk onSubmit={uploadTemplate}>
            <Button variant="white" className="whitespace-nowrap">
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
                  variant="white"
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
          updateData: (id: string, key: string, value: unknown) => {
            update(id, {
              [key]: value,
            });
          },
          removeData: (id: string) => {
            remove(id);
          },
        }}
        onSortingChange={setSorting}
        onSelectedRowsChange={setSelectedRows}
      />
    </div>
  );
}
