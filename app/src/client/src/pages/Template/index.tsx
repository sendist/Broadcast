import { DataTable } from "@/components/ui/data-table";
import { Template, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { AddTemplateForm } from "./add";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

export default function TemplatePage() {
  const { data, loading, update, remove, create } = useCRUD<Template>({
    url: "/template",
  });

  const { data: types } = useCRUD<{
    value: string;
    label: string;
    replacements: string[];
    repetition: boolean;
  }>({
    url: "/template/types",
  });

  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="inline-block text-xl font-semibold">Template</h1>
        <div className="space-x-4">
          <AddTemplateForm onSubmit={create} types={types || []}>
            <Button variant="outline">
              <PlusIcon className="mr-2" />
              Add
            </Button>
          </AddTemplateForm>
        </div>
      </div>
      <DataTable
        columns={columns(types || [])}
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
