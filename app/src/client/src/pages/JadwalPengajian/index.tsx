import { DataTable } from "@/components/ui/data-table";
import { JadwalPengajian, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { AddJadwalPengajianForm } from "./add";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { AddJadwalPengajianBulk } from "./bulk";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";

export default function Masjid() {
  const { data, loading, update, remove, create } = useCRUD<JadwalPengajian>({
    url: "/jadwal-pengajian",
  });

  const apiFetch = useApiFetch();

  function uploadTemplate(file: File) {
    apiFetch({
      url: `${BASE_URL}/jadwal-pengajian/upload`,
      options: {
        headers: {
          "Content-Type": file.type,
        },
        method: "POST",
        body: file,
      },
    });
  }

  return (
    <div>
      <div className="space-x-4">
        <AddJadwalPengajianForm onSubmit={create}>
          <Button variant="outline" className="mb-4">
            <PlusIcon className="mr-2" />
            Add
          </Button>
        </AddJadwalPengajianForm>
        <AddJadwalPengajianBulk onSubmit={uploadTemplate}>
          <Button variant="outline" className="mb-4">
            <PlusIcon className="mr-2" />
            Bulk Upload
          </Button>
        </AddJadwalPengajianBulk>
      </div>
      <DataTable
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
      />
    </div>
  );
}
