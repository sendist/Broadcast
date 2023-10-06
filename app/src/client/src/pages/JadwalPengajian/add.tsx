import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn, formatDate, resetDateTimeToMidnight } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import AddForm, { RenderFormInput } from "@/components/custom/addForm";
import InputDropdown from "@/components/custom/inputDropdown";

const jadwalPengajianFormSchema = z.object({
  tanggal: z.date({
    required_error: "Tanggal pengajian harus diisi",
  }),
  waktu: z.string().nonempty({
    message: "Waktu pengajian harus diisi",
  }),
  id_masjid: z.string().nonempty({
    message: "Kode masjid harus diisi",
  }),
  id_mubaligh: z.string().nonempty({
    message: "Kode mubaligh harus diisi",
  }),
});

export function AddJadwalPengajianForm({
  masjidDropdown,
  mubalighDropdown,
  children,
  onSubmit,
}: {
  masjidDropdown: { label: string; value: string }[];
  mubalighDropdown: { label: string; value: string }[];
  children: React.ReactNode;
  onSubmit: (data: {
    tanggal: Date;
    waktu: string;
    id_masjid: number;
    id_mubaligh: number;
  }) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof jadwalPengajianFormSchema>>({
    resolver: zodResolver(jadwalPengajianFormSchema),
    defaultValues: {
      waktu: "",
    },
  });

  const renderFormInput: RenderFormInput<typeof form> = [
    {
      name: "tanggal",
      label: "Tanggal Pengajian",
      customInput: <T extends FieldValues>({
        field,
      }: {
        field: ControllerRenderProps<T, Path<T>>;
      }) => {
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  formatDate(field.value)
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) =>
                  date && field.onChange(resetDateTimeToMidnight(date))
                }
                defaultMonth={field.value}
                initialFocus
                required
              />
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      name: "waktu",
      label: "Waktu Pengajian",
      placeholder: "Waktu Pengajian",
    },
    {
      name: "id_masjid",
      label: "Masjid",
      customInput: <T extends FieldValues>({
        field,
      }: {
        field: ControllerRenderProps<T, Path<T>>;
      }) => {
        return (
          <InputDropdown
            value={field.value}
            select={masjidDropdown}
            onChange={field.onChange}
            placeholder="Pilih Masjid..."
            align={"start"}
            side={"top"}
          />
        );
      },
    },
    {
      name: "id_mubaligh",
      label: "Kode Mubaligh",
      placeholder: "Kode Mubaligh",
      customInput: <T extends FieldValues>({
        field,
      }: {
        field: ControllerRenderProps<T, Path<T>>;
      }) => {
        return (
          <InputDropdown
            value={field.value}
            select={mubalighDropdown}
            onChange={field.onChange}
            placeholder="Pilih Mubaligh..."
            align={"start"}
            side={"top"}
          />
        );
      },
    },
  ];
  return (
    <AddForm
      title="Tambah Data Jadwal Pengajian"
      subtitle="Input data jadwal pengajian yang akan ditambahkan"
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      onSubmit={onSubmit}
      form={form}
      renderFormInput={renderFormInput}
    >
      {children}
    </AddForm>
  );
}
