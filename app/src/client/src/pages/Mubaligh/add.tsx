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

const mubalighFormSchema = z.object({
  nama_mubaligh: z.string().nonempty({
    message: "Nama Mubaligh harus diisi",
  }),
  no_hp: z.string().regex(/^08[0-9]{8,11}$/, {
    message: "No HP harus dimulai dengan 08 dan berjumlah 10-13 digit",
  }),
});

const renderFormData = [
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

export function AddMubalighForm({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (data: {
    nama_mubaligh: string;
    no_hp: string;
  }) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof mubalighFormSchema>>({
    resolver: zodResolver(mubalighFormSchema),
    defaultValues: {
      nama_mubaligh: "",
      no_hp: "",
    },
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Data Mubaligh</DialogTitle>
          <DialogDescription>
            Input data mubaligh yang akan ditambahkan ke dalam daftar
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
            {renderFormData.map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={item.placeholder} {...field} />
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
