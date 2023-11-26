import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogContent from "@/components/custom/formDialogContent";
import { RenderFormInput } from "@/components/custom/formDialog";

const changePasswordFormSchema = z
  .object({
    old_password: z.string().min(1, "Password lama harus diisi"),
    new_password: z.string().min(1, "Password baru harus diisi"),
    confirm_password: z.string().min(1, "Konfirmasi password harus diisi"),
  })
  .refine(
    ({ new_password, confirm_password }) => new_password === confirm_password,
    {
      message: "Konfirmasi password tidak sesuai",
      path: ["confirm_password"],
    }
  );

type Fields = z.infer<typeof changePasswordFormSchema>;

type Props = {
  onSubmit: (data: Fields) => void;
};

export function ChangeSelfPasswordForm({ onSubmit }: Props) {
  const form = useForm<Fields>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const renderFormInput: RenderFormInput<Fields> = [
    {
      name: "old_password",
      label: "Password Lama",
      placeholder: "Password lama",
      type: "password",
    },
    {
      name: "new_password",
      label: "Password Baru",
      placeholder: "Password baru",
      type: "password",
    },
    {
      name: "confirm_password",
      label: "Konfirmasi Password",
      placeholder: "Ketik ulang password baru",
      type: "password",
    },
  ];

  return (
    <FormDialogContent
      title="Change Password"
      subtitle="Reset password menjadi password baru"
      onSubmit={onSubmit}
      form={form}
      renderFormInput={renderFormInput}
    />
  );
}
