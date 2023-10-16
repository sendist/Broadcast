import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  align?: "start" | "end" | "center";
  side?: "top" | "bottom" | "right" | "left";
};
import { Button } from "@/components/ui/button";

export default function InputCalendar({
  value,
  onChange,
  placeholder,
  align,
  side,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {value ? (
            formatDate(value)
          ) : (
            <span>{placeholder ?? "Pick a date"}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align} side={side}>
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => date && onChange(date)}
          defaultMonth={value}
          initialFocus
          required
        />
      </PopoverContent>
    </Popover>
  );
}
