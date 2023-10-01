import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const templateFormSchema = z.object({
  nama_template: z.string().nonempty({
    message: "Nama Template harus diisi",
  }),
  content: z.string().nonempty({
    message: "Content harus diisi",
  }),
});

const renderFormData = [
  {
    name: "nama_template",
    label: "Nama Template",
    placeholder: "Nama Template",
  },
  {
    name: "content",
    label: "Content",
    placeholder: "Content",
  },
] as const;

export function AddTemplateForm({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (data: { nama_template: string; content: string }) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof templateFormSchema>>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      nama_template: "",
      content: "",
    },
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Data Template</DialogTitle>
          <DialogDescription>
            Input data template yang akan ditambahkan ke dalam daftar
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              setDialogOpen(false);
              onSubmit(data);
              form.reset();
            })}
            className="space-y-8"
          >
            {renderFormData.map((item, index) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      {index === 0 ? (
                        <Input placeholder={item.placeholder} {...field} />
                      ) : (
                        <Textarea placeholder={item.placeholder} {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
