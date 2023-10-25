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
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  value: string;
  select: readonly { label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  align?: "start" | "end" | "center";
  side?: "top" | "bottom" | "right" | "left";
  disabled?: boolean;
};

export default function InputDropdown({
  value,
  select,
  onChange,
  placeholder,
  align,
  side,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between disabled:cursor-not-allowed"
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
            <ScrollArea className="max-h-[200px]">
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
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
