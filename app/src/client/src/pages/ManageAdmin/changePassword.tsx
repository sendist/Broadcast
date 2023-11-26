import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogContent from "@/components/custom/formDialogContent";
import { RenderFormInput } from "@/components/custom/formDialog";

const changePasswordFormSchema = z.object({
  password: z.string().min(1, "Password baru harus diisi"),
});

type Fields = z.infer<typeof changePasswordFormSchema>;

type Props = {
  onSubmit: (data: Fields) => void;
};

export function ChangePasswordForm({ onSubmit }: Props) {
  const form = useForm<Fields>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const renderFormInput: RenderFormInput<Fields> = [
    {
      name: "password",
      label: "Password",
      placeholder: "Password",
      type: "password",
    },
  ];

  return (
    <FormDialogContent
      title="Change Password Admin"
      subtitle="Reset password admin menjadi password baru"
      onSubmit={onSubmit}
      form={form}
      renderFormInput={renderFormInput}
    />
  );
}
