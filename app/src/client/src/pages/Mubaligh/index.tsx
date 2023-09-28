import { useCRUD } from "@/hooks/backend";

export default function Mubaligh() {
  const { data } = useCRUD({
    url: "/mubaligh",
  });

  return (
    <div>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
