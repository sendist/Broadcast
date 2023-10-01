import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { CellContext, TableMeta } from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { whatsappFormatting } from "@/lib/utils";

interface CustomTableMeta<T extends { id: string }> extends TableMeta<T> {
  updateData?: (id: string, columnId: string, value: string) => void;
}

export function EditCell<T extends { id: string }>({
  row,
  getValue,
  table,
  cell,
  textArea,
  whatsappFormat,
}: CellContext<T, unknown> & {
  textArea?: boolean;
  whatsappFormat?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [value, setValue] = useState(getValue<string>());
  const id = row.original.id;

  function edit() {
    setIsEditing(false);
    if (!dataChanged) {
      return;
    }
    (table.options.meta as CustomTableMeta<T>)?.updateData?.(
      id,
      cell.column.id,
      value
    );
  }

  return (
    <>
      {isEditing ? (
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
            <span className="text-xs text-gray-600">shift + enter to save</span>
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
        <div
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
      )}
    </>
  );
}
