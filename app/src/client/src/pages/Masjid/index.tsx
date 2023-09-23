import { useCRUD } from "@/hooks/backend";

export default function Masjid() {
  const { data, loading } = useCRUD({
    url: "/masjid",
  });

  return <div>{loading ? <div>Loading...</div> : JSON.stringify(data)}</div>;
}
