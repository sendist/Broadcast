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
  const { data, loading, update, remove, create, get } =
    useCRUD<JadwalPengajian>({
      url: "/jadwal-pengajian",
    });

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
      type: "pengajian_reminder",
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
    }).then(() => {
      get();
    });
  }

  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="inline-block text-xl font-semibold">Pengajian</h1>
        <div className="space-x-4">
          <AddJadwalPengajianForm
            onSubmit={create}
            mubalighDropdown={mubalighDropdown || []}
            masjidDropdown={masjidDropdown || []}
          >
            <Button variant="outline">
              <PlusIcon className="mr-2" />
              Add
            </Button>
          </AddJadwalPengajianForm>
          <AddJadwalPengajianBulk onSubmit={uploadTemplate}>
            <Button variant="outline">
              <PlusIcon className="mr-2" />
              Bulk Upload
            </Button>
          </AddJadwalPengajianBulk>
        </div>
      </div>
      <DataTable
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
      />
    </div>
  );
}
