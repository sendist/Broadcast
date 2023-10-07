import { DataTable } from "@/components/ui/data-table";
import { MessageLog, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";

export default function MessageLogs() {
  const { data, loading, remove } = useCRUD<MessageLog>({
    url: "/message-logs",
  });

  return (
    <div>
      <div className="space-x-4"></div>
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        meta={{
          removeData: (id: string) => {
            remove(id);
          },
          resend: (id: string) => {
            console.log(id);
          },
        }}
      />
    </div>
  );
}
