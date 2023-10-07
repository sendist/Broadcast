import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ControllerRenderProps,
  FieldValues,
  Path,
  useForm 
} from "react-hook-form";

import { Input } from "@/components/ui/input";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import AddForm, { RenderFormInput } from "@/components/custom/addForm";
import InputDropdown from "@/components/custom/inputDropdown";

const templateFormSchema = z.object({
  nama_template: z.string().nonempty({
    message: "Nama Template harus diisi",
  }),
  content: z.string().nonempty({
    message: "Content harus diisi",
  }),
  type: z.enum(["pengajian_bulanan", "pengajian_reminder", "jumatan_reminder"]),
});

export function AddTemplateForm({
  typeDropdown,
  children,
  onSubmit,
}: {
  typeDropdown: { label: string; value: string }[];
  children: React.ReactNode;
  onSubmit: (data: {
    nama_template: string;
    content: string;
    type: string
  }) => void;
}) {
  // Open dialog when adding new data
  const [dialogOpen, setDialogOpen] = useState(false);

  const typeDropdownData = [
    { label: "Pengajian Bulanan", value: "pengajian_bulanan" },
    { label: "Pengajian Reminder", value: "pengajian_reminder" },
    { label: "Jumatan Reminder", value: "jumatan_reminder" },
  ];

  const form = useForm<z.infer<typeof templateFormSchema>>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      nama_template: "",
      content: "",
    },
  });

  const renderFormInput: RenderFormInput<typeof form> = [
    {
      name: "nama_template",
      label: "Nama Template",
      customInput: <T extends FieldValues>({
        field,
      }: {
        field: ControllerRenderProps<T, Path<T>>;
      }) => {
        return (
          <Input placeholder="Nama Template" {...field} />
        );
      },
    },
    {
      name: "content",
      label: "Content Pesan",
      customInput: <T extends FieldValues>({
        field,
      }: {
        field: ControllerRenderProps<T, Path<T>>;
      }) => {
        return (
          <Textarea placeholder="Content Pesan" {...field} />
        );
      },
    },
    {
      name: "type",
      label: "Type Pesan Broadcast",
      customInput: <T extends FieldValues>({
        field,
      }: {
        field: ControllerRenderProps<T, Path<T>>;
      }) => {
        return (
          <InputDropdown
            value={field.value}
            select={typeDropdown}
            onChange={field.onChange}
            placeholder="Pilih Type . . ."
            align={"start"}
            side={"top"}
          />
        );
      },
    },
  ];

  return(
    <AddForm
      title="Tambah Data Template"
      subtitle="Input data template yang akan ditambahkan ke dalam daftar"
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      typeDropdown={typeDropdownData}
      onSubmit={onSubmit}
      form={form}
      renderFormInput={renderFormInput}
    >
      {children}
    </AddForm>
  )
}
