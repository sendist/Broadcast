import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  select: { label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  align?: "start" | "end" | "center";
  side?: "top" | "bottom" | "right" | "left";
};

export default function InputDropdown({
  value,
  select,
  onChange,
  placeholder,
  align,
  side,
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? select.find((item) => item.value === value)?.label
            : placeholder ?? "Pilih..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align} side={side}>
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {select.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                {item.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}