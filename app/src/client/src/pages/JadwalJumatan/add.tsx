import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import { useState } from "react";
import AddForm, { RenderFormInput } from "@/components/custom/addForm";
import InputDropdown from "@/components/custom/inputDropdown";
import InputCalendar from "@/components/custom/inputCalendar";
import { resetDateTimeToMidnight } from "@/lib/utils";

const jadwalJumatanFormSchema = z.object({
  tanggal: z.date({
    required_error: "Tanggal jumatan harus diisi",
  }),
  id_masjid: z.string().nonempty({
    message: "Masjid harus diisi",
  }),
  id_mubaligh: z.string().nonempty({
    message: "Mubaligh harus diisi",
  }),
});

export function AddJadwalJumatanForm({
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
    id_masjid: number;
    id_mubaligh: number;
  }) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof jadwalJumatanFormSchema>>({
    resolver: zodResolver(jadwalJumatanFormSchema),
  });

  const renderFormInput: RenderFormInput<typeof form> = [
    {
      name: "tanggal",
      label: "Tanggal Jumatan",
      customInput: <T extends FieldValues>({
        field,
      }: {
        field: ControllerRenderProps<T, Path<T>>;
      }) => {
        return (
          <InputCalendar
            value={field.value}
            onChange={(date) => field.onChange(resetDateTimeToMidnight(date))}
            placeholder="Pilih Tanggal Jumatan..."
            align={"start"}
          />
        );
      },
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
      title="Tambah Data Jadwal Jumatan"
      subtitle="Input data jadwal jumatan yang akan ditambahkan"
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
