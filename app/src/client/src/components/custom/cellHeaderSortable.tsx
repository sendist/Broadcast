import { CaretSortIcon, CaretUpIcon, CaretDownIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { HeaderContext } from "@tanstack/react-table";

export default function CellHeaderSortable<T>(
  { column }: HeaderContext<T, unknown>,
  name: string
) {
  return (
    <Button
      variant="ghost"
      onClick={column.getToggleSortingHandler()}
    >
      {name}
      {column.getIsSorted() === "asc" ? (
        <CaretUpIcon className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "desc" ? (
        <CaretDownIcon className="ml-2 h-4 w-4" />
      ) : (
        <CaretSortIcon className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}
