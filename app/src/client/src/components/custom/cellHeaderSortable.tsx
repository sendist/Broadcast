import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { HeaderContext } from "@tanstack/react-table";

export default function CellHeaderSortable<T>(
  { column }: HeaderContext<T, unknown>,
  name: string
) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {name}
      <CaretSortIcon className="ml-2 h-4 w-4" />
    </Button>
  );
}
