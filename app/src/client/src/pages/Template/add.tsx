import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import AddForm, { RenderFormInput } from "@/components/custom/addForm";
import InputDropdown from "@/components/custom/inputDropdown";
export function AddTemplateForm({
  types,
  children,
  onSubmit,
}: {
  types: {
    label: string;
    value: string;
    replacements: string[];
    repetition: boolean;
  }[];
  children: React.ReactNode;
  onSubmit: (data: {
    nama_template: string;
    content: string;
    type: string;
  }) => void;
}) {
  const templateFormSchema = z.object({
    nama_template: z.string().min(1, "Nama Template harus diisi"),
    content: z.string().min(1, "Content harus diisi"),
    type: z.enum(
      types.map((type) => type.value) as unknown as [string, ...string[]],
      {
        errorMap: () => {
          return { message: "Pilih Tipe Pesan" };
        },
      }
    ),
  });

  type Fields = z.infer<typeof templateFormSchema>;

  const form = useForm<Fields>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      nama_template: "",
      content: "",
      type: "",
    },
  });

  const renderFormInput: RenderFormInput<Fields> = [
    {
      name: "nama_template",
      label: "Nama Template",
      placeholder: "Nama Template",
    },
    {
      name: "content",
      label: "Content Pesan",
      placeholder: "Content Pesan",
      textarea: true,
    },
    {
      name: "type",
      label: "Tipe Pesan Broadcast",
      customInput: <T extends FieldValues>({
        field,
      }: {
        field: ControllerRenderProps<T, Path<T>>;
      }) => {
        return (
          <InputDropdown
            value={field.value}
            select={types}
            onChange={field.onChange}
            placeholder="Pilih Tipe..."
            align={"start"}
            side={"top"}
          />
        );
      },
    },
  ];

  return (
    <AddForm
      title="Tambah Data Template"
      subtitle="Input data template yang akan ditambahkan ke dalam daftar"
      onSubmit={onSubmit}
      form={form}
      renderFormInput={renderFormInput}
    >
      {children}
    </AddForm>
  );
}
