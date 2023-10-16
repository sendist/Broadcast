import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import { resetDateTimeToMidnight } from "@/lib/utils";
import AddForm, { RenderFormInput } from "@/components/custom/addForm";
import InputDropdown from "@/components/custom/inputDropdown";
import InputCalendar from "@/components/custom/inputCalendar";
import { JadwalPengajian } from "./columns";

const jadwalPengajianFormSchema = z.object({
  tanggal: z.date({
    required_error: "Tanggal pengajian harus diisi",
  }),
  waktu: z.string().min(1, "Waktu pengajian harus diisi"),
  id_masjid: z.string().min(1, "Kode masjid harus diisi"),
  id_mubaligh: z.string().min(1, "Kode mubaligh harus diisi"),
});

type Fields = z.infer<typeof jadwalPengajianFormSchema>;

export function AddJadwalPengajianForm({
  masjidDropdown,
  mubalighDropdown,
  children,
  onSubmit,
}: {
  masjidDropdown: { label: string; value: string }[];
  mubalighDropdown: { label: string; value: string }[];
  children: React.ReactNode;
  onSubmit: (data: Omit<JadwalPengajian, "id">) => void;
}) {
  const form = useForm<Fields>({
    resolver: zodResolver(jadwalPengajianFormSchema),
    defaultValues: {
      waktu: "",
    },
  });

  const renderFormInput: RenderFormInput<Fields> = [
    {
      name: "tanggal",
      label: "Tanggal Pengajian",
      customInput: <T extends FieldValues>({
        field,
      }: {
        field: ControllerRenderProps<T, Path<T>>;
      }) => {
        return (
          <InputCalendar
            value={field.value}
            onChange={(date) => field.onChange(resetDateTimeToMidnight(date))}
            placeholder="Pilih Tanggal Pengajian..."
            align={"start"}
          />
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
    <AddForm
      title="Tambah Data Jadwal Pengajian"
      subtitle="Input data jadwal pengajian yang akan ditambahkan"
      onSubmit={onSubmit}
      form={form}
      renderFormInput={renderFormInput}
    >
      {children}
    </AddForm>
  );
}
