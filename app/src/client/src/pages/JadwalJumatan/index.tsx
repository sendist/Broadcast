import { DataTable } from "@/components/ui/data-table";
import { JadwalJumatan, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { AddJadwalJumatanForm } from "./add";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { AddJadwalJumatanBulk } from "./bulk";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";

export default function Masjid() {
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
