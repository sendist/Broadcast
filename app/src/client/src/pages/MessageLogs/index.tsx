import { DataTable } from "@/components/ui/data-table";
import { MessageLog, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";

export default function MessageLogs() {
  const { data, loading, remove } = useCRUD<MessageLog>({
    url: "/message-logs",
    params: {
      orderBy: "send_time",
      orderType: "desc",
    },
  });
  const apiFetch = useApiFetch();

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
            apiFetch({
              url: `${BASE_URL}/message-logs/resend/${id}`,
            });
          },
        }}
      />
    </div>
  );
}
