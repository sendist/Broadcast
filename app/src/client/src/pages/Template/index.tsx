import { DataTable } from "@/components/ui/data-table";
import { Template, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { AddTemplateForm } from "./add";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";

export default function Template() {
  const { data, loading, update, remove, create } = useCRUD<Template>({
    url: "/template",
  });

  const apiFetch = useApiFetch();

  return (
    <div>
      <div className="space-x-4">
        <AddTemplateForm onSubmit={create}>
          <Button variant="outline" className="mb-4">
            <PlusIcon className="mr-2" />
            Add
          </Button>
        </AddTemplateForm>
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