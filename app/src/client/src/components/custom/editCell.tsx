import { CheckIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { CellContext, TableMeta } from "@tanstack/react-table";
import { LegacyRef, forwardRef, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  cn,
  formatDate,
  resetDateTimeToMidnight,
  whatsappFormatting,
} from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Calendar } from "../ui/calendar";

interface CustomTableMeta<T extends { id: string }> extends TableMeta<T> {
  updateData?: (id: string, columnId: string, value: string) => void;
}

const TextPreview = forwardRef(
  (
    {
      value,
      whatsappFormat,
      setIsEditing,
    }: {
      value: string;
      whatsappFormat?: boolean;
      setIsEditing: (value: boolean) => void;
    },
    ref: LegacyRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className="group flex flex-row items-center"
        onDoubleClick={() => setIsEditing(true)}
      >
        {whatsappFormat ? (
          whatsappFormatting(value)
        ) : (
          <p className="whitespace-pre-wrap">{value}</p>
        )}

        <Button
          variant="ghost"
          className="ml-2 px-1 py-1"
          onClick={() => setIsEditing(true)}
        >
          <Pencil1Icon className="opacity-0 group-hover:opacity-100" />
        </Button>
      </div>
    );
  }
);

export function EditCell<T extends { id: string }>({
  row,
  getValue,
  table,
  cell,
  textArea,
  whatsappFormat,
  select,
  calendar,
}: CellContext<T, unknown> & {
  whatsappFormat?: boolean;
} & (
    | {
        textArea?: true;
        select?: undefined;
        calendar?: undefined;
      }
    | {
        textArea?: undefined;
        select?: { value: string; label: string }[];
        calendar?: undefined;
      }
    | {
        textArea?: undefined;
        select?: undefined;
        calendar?: true;
      }
    | {
        textArea?: undefined;
        select?: undefined;
        calendar?: undefined;
      }
  )) {
  const [isEditing, setIsEditing] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [value, setValue] = useState(getValue<string>());
  const id = row.original.id;

  useEffect(() => {
    setValue(getValue<string>());
  }, [cell.row.index, getValue]);

  function edit(overrideVal?: string) {
    setIsEditing(false);
    if (!dataChanged && !select && !calendar) {
      return;
    }
    (table.options.meta as CustomTableMeta<T>)?.updateData?.(
      id,
      cell.column.id,
      overrideVal ?? value
    );
  }

  return (
    <>
      {select || calendar ? (
        <Popover open={isEditing} onOpenChange={setIsEditing}>
          <PopoverTrigger asChild onClick={(e) => e.preventDefault()}>
            <TextPreview
              value={
                select
                  ? select.find((item) => item.value === value)?.label ?? ""
                  : formatDate(value, true)
              }
              whatsappFormat={whatsappFormat}
              setIsEditing={() => setIsEditing(true)}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {select && (
              <Command>
                <CommandInput placeholder="Search..." className="h-9" />
                <CommandEmpty>No item found.</CommandEmpty>
                <CommandGroup>
                  {select.map((item) => (
                    <CommandItem
                      key={item.value}
                      onSelect={() => {
                        setValue(item.value);
                        edit(item.value);
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
            )}
            {calendar && (
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => {
                  if (!date) return;
                  // reset time to 00:00:00
                  const ISODate = resetDateTimeToMidnight(date).toISOString();
                  setValue(ISODate);
                  edit(ISODate);
                }}
                defaultMonth={new Date(value)}
                required
                initialFocus
              />
            )}
          </PopoverContent>
        </Popover>
      ) : isEditing ? (
        textArea ? (
          <>
            <Textarea
              rows={10}
              value={value}
              onChange={(e) => {
                setDataChanged(true);
                setValue(e.target.value);
              }}
              onBlur={() => {
                edit();
              }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  edit();
                }
              }}
            />
            <span className="text-xs text-gray-600">Shift + Enter to Save</span>
          </>
        ) : (
          <Input
            value={value}
            onChange={(e) => {
              setDataChanged(true);
              setValue(e.target.value);
            }}
            onBlur={() => {
              edit();
            }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                edit();
              }
            }}
          />
        )
      ) : (
        <TextPreview
          value={value}
          whatsappFormat={whatsappFormat}
          setIsEditing={setIsEditing}
        />
      )}
    </>
  );
}
