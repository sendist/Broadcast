import { useCRUD } from "@/hooks/backend";

export default function Masjid() {
  const { data } = useCRUD({
    url: "/masjid",
  });

  return <>{JSON.stringify(data)}</>;
}
