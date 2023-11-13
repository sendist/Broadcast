import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AddForm, { RenderFormInput } from "@/components/custom/addForm";
import { User } from "./columns";

const userFormSchema = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
});

type Fields = z.infer<typeof userFormSchema>;

type FormValues = Fields & { role: "superadmin" | "admin" };

type Props = {
  children: React.ReactNode;
  onSubmit: (data: Omit<User, "id">) => void;
};

export function AddUserForm({ children, onSubmit }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(userFormSchema),
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
    {
      name: "password",
      label: "Password",
      placeholder: "Password",
    },
  ];

  return (
    <AddForm
      title="Tambah Admin"
      subtitle="Input data akun admin yang akan dibuat"
      onSubmit={onSubmit}
      form={form}
      renderFormInput={renderFormInput}
    >
      {children}
    </AddForm>
  );
}
