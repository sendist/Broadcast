import { DataTable } from "@/components/ui/data-table";
import { Masjid, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { AddMasjidForm } from "./add";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { AddMasjidBulk } from "./bulk";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";

export default function Masjid() {
  const { data, loading, update, remove, create, get } = useCRUD<Masjid>({
    url: "/masjid",
  });

  const apiFetch = useApiFetch();

  function uploadTemplate(file: File) {
    apiFetch({
      url: `${BASE_URL}/masjid/upload`,
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
      <div className="space-x-4">
        <AddMasjidForm onSubmit={create}>
          <Button variant="outline" className="mb-4">
            <PlusIcon className="mr-2" />
            Add
          </Button>
        </AddMasjidForm>
        <AddMasjidBulk onSubmit={uploadTemplate}>
          <Button variant="outline" className="mb-4">
            <PlusIcon className="mr-2" />
            Bulk Upload
          </Button>
        </AddMasjidBulk>
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
