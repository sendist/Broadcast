import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialog, { RenderFormInput } from "@/components/custom/formDialog";
import { Jamaah } from "./columns";

const jamaahFormSchema = z.object({
  nama_jamaah: z.string().min(1, "Nama Jamaah harus diisi"),
  no_hp: z
    .string()
    .regex(
      /^(62|0)8[0-9]{7,11}$/,
      "No HP harus dimulai dengan 08 atau 628 dan berjumlah 10-14 digit"
    ),
});

type Fields = z.infer<typeof jamaahFormSchema>;

type Props = {
  children: React.ReactNode;
  onSubmit: (data: Omit<Jamaah, "id">) => void;
};

export function AddJamaahForm({ children, onSubmit }: Props) {
  const form = useForm<Fields>({
    resolver: zodResolver(jamaahFormSchema),
    defaultValues: {
      nama_jamaah: "",
      no_hp: "",
    },
  });

  const renderFormInput: RenderFormInput<Fields> = [
    {
      name: "nama_jamaah",
      label: "Nama Jamaah",
      placeholder: "Nama Jamaah",
    },
    {
      name: "no_hp",
      label: "No HP",
      placeholder: "No HP",
    },
  ];

  return (
    <FormDialog
      title="Tambah Data Jamaah"
      subtitle="Input data jamaah yang akan ditambahkan ke dalam daftar jamaah"
      onSubmit={onSubmit}
      form={form}
      renderFormInput={renderFormInput}
    >
      {children}
    </FormDialog>
  );
}
