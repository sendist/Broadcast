import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import FormDialog, { RenderFormInput } from "@/components/custom/formDialog";
import InputDropdown from "@/components/custom/inputDropdown";
import InputCalendar from "@/components/custom/inputCalendar";
import { resetDateTimeToMidnight } from "@/lib/utils";
import { JadwalJumatan } from "./columns";

const jadwalJumatanFormSchema = z.object({
  tanggal: z.date({
    required_error: "Tanggal jumatan harus diisi",
  }),
  id_masjid: z.string().min(1, "Masjid harus diisi"),
  id_mubaligh: z.string().min(1, "Mubaligh harus diisi"),
});

type Fields = z.infer<typeof jadwalJumatanFormSchema>;

export function AddJadwalJumatanForm({
  masjidDropdown,
  mubalighDropdown,
  children,
  onSubmit,
}: {
  masjidDropdown: { label: string; value: string }[];
  mubalighDropdown: { label: string; value: string }[];
  children: React.ReactNode;
  onSubmit: (data: Omit<JadwalJumatan, "id">) => void;
}) {
  const form = useForm<Fields>({
    resolver: zodResolver(jadwalJumatanFormSchema),
  });

  const renderFormInput: RenderFormInput<Fields> = [
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
      label: "Mubaligh",
      placeholder: "Mubaligh",
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
    <FormDialog
      title="Tambah Data Jadwal Jumatan"
      subtitle="Input data jadwal jumatan yang akan ditambahkan"
      onSubmit={onSubmit}
      form={form}
      renderFormInput={renderFormInput}
    >
      {children}
    </FormDialog>
  );
}
