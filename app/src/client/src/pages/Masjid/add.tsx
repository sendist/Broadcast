import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AddForm, { RenderFormInput } from "@/components/custom/addForm";

const masjidFormSchema = z.object({
  nama_masjid: z.string().min(1, "Nama Masjid harus diisi"),
  nama_ketua_dkm: z.string().min(1, "Nama Ketua DKM harus diisi"),
  no_hp: z
    .string()
    .regex(
      /^(62|0)8[0-9]{7,11}$/,
      "No HP harus dimulai dengan 08 atau 628 dan berjumlah 10-14 digit"
    ),
});

type Props = {
  children: React.ReactNode;
  onSubmit: (data: {
    nama_masjid: string;
    nama_ketua_dkm: string;
    no_hp: string;
  }) => void;
};

export function AddMasjidForm({ children, onSubmit }: Props) {
  const form = useForm<z.infer<typeof masjidFormSchema>>({
    resolver: zodResolver(masjidFormSchema),
    defaultValues: {
      nama_masjid: "",
      nama_ketua_dkm: "",
      no_hp: "",
    },
  });

  const renderFormInput: RenderFormInput<typeof form> = [
    {
      name: "nama_masjid",
      label: "Nama Masjid",
      placeholder: "Nama Masjid",
    },
    {
      name: "nama_ketua_dkm",
      label: "Nama Ketua DKM",
      placeholder: "Nama Ketua DKM",
    },
    {
      name: "no_hp",
      label: "No HP",
      placeholder: "No HP",
    },
  ] as const;

  return (
    <AddForm
      title="Tambah Data Masjid"
      subtitle="Input data masjid yang akan ditambahkan ke dalam daftar"
      onSubmit={onSubmit}
      form={form}
      renderFormInput={renderFormInput}
    >
      {children}
    </AddForm>
  );
}
