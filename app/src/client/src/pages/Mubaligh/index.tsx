import { useCRUD } from "@/hooks/backend";

export default function Mubaligh() {
  const { data } = useCRUD({
    url: "/mubaligh",
  });

  return <>{JSON.stringify(data)}</>;
}
