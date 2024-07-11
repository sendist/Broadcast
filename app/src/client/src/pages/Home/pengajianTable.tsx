import { DataTable } from "@/components/ui/data-table";
import { useCRUD } from "@/hooks/backend";
import { useState, useRef, useEffect } from "react";
import { SortingState, Table as TableType } from "@tanstack/react-table";
import useFirstRender from "@/hooks/firstRender";
import { pengajianColumns, JadwalPengajian } from "./columns";

const limit = 20;

export default function PengajianTable() {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  const currentDate = new Date();
  const dateStart = new Date().toISOString();
  const dateEnd = new Date(currentDate.setDate(currentDate.getDate() + 3)).toISOString();

  const { data, loading, update, remove, get } = useCRUD<JadwalPengajian>({
    url: "/jadwal-pengajian",
    params: {
      page: page.toString(),
      limit: limit.toString(),
      ...(sorting[0] && {
        orderBy: sorting[0].id,
        orderType: sorting[0].desc ? "desc" : "asc",
      }),
      dateStart: dateStart,
      dateEnd: dateEnd,
    },
  });

  const { data: masjidData } = useCRUD<{
    id: string;
    nama_masjid: string;
  }>({
    url: "/masjid",
    params: {
      fields: "id,nama_masjid",
    },
  });
  
  const { data: mubalighData } = useCRUD<{
    id: string;
    nama_mubaligh: string;
  }>({
    url: "/mubaligh",
    params: {
      fields: "id,nama_mubaligh",
    },
  });

  const masjid = masjidData?.map((item) => ({
    label: item.nama_masjid,
    value: item.id,
  }));

  const mubaligh = mubalighData?.map((item) => ({
    label: item.nama_mubaligh,
    value: item.id,
  }));

  const tableRef = useRef<TableType<JadwalPengajian>>(null);
  const isFirstRender = useFirstRender();

  useEffect(() => {
    if (!isFirstRender) {
      get();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sorting]);

  return (
    <DataTable
      ref={tableRef}
      columns={pengajianColumns(
        masjid || [],
        mubaligh || [],
      )}
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
    />
  );
}
