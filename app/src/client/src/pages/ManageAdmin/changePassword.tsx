import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AddForm, { RenderFormInput } from "@/components/custom/changePassword";
import { User } from "./columns";

const changePasswordFormSchema = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
});

type Fields = z.infer<typeof changePasswordFormSchema>;

type FormValues = Fields & { role: "superadmin" | "admin" };

type Props = {
  children: React.ReactNode;
  onSubmit: (data: Omit<User, "id">) => void;
};

export function ChangePasswordForm({ children, onSubmit }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "admin",
    },
  });

  const renderFormInput: RenderFormInput<FormValues> = [
    {
      name: "username",
      label: "Username",
      placeholder: "Username",
    },
    // {
    //   name: "password",
    //   label: "Password",
    //   placeholder: "Password",
    // },
  ];

  return (
    <AddForm
      title="Edit Data Admin"
      subtitle="Edit data admin"
      onSubmit={onSubmit}
      form={form}
      renderFormInput={renderFormInput}
    >
      {children}
    </AddForm>
  );
}
