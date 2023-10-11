import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AddForm, { RenderFormInput } from "@/components/custom/addForm";

const mubalighFormSchema = z.object({
  nama_mubaligh: z.string().min(1, "Nama Mubaligh harus diisi"),
  no_hp: z
    .string()
    .regex(
      /^(62|0)8[0-9]{7,11}$/,
      "No HP harus dimulai dengan 08 atau 628 dan berjumlah 10-14 digit"
    ),
});

type Props = {
  children: React.ReactNode;
  onSubmit: (data: { nama_mubaligh: string; no_hp: string }) => void;
};

export function AddMubalighForm({ children, onSubmit }: Props) {
  const form = useForm<z.infer<typeof mubalighFormSchema>>({
    resolver: zodResolver(mubalighFormSchema),
    defaultValues: {
      nama_mubaligh: "",
      no_hp: "",
    },
  });

  const renderFormInput: RenderFormInput<typeof form> = [
    {
      name: "nama_mubaligh",
      label: "Nama Mubaligh",
      placeholder: "Nama Mubaligh",
    },
    {
      name: "no_hp",
      label: "No HP",
      placeholder: "No HP Mubaligh",
    },
  ] as const;

  return (
    <AddForm
      title="Tambah Data Mubaligh"
      subtitle="Input data mubaligh yang akan ditambahkan ke dalam daftar"
      onSubmit={onSubmit}
      form={form}
      renderFormInput={renderFormInput}
    >
      {children}
    </AddForm>
  );
}
