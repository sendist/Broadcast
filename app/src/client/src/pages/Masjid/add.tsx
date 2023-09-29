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

const masjidFormSchema = z.object({
  nama_masjid: z.string().nonempty({
    message: "Nama Masjid harus diisi",
  }),
  nama_ketua_dkm: z.string().nonempty({
    message: "Nama Ketua DKM harus diisi",
  }),
  no_hp: z.string().regex(/^08[0-9]{8,11}$/, {
    message: "No HP harus dimulai dengan 08 dan berjumlah 10-13 digit",
  }),
});

const renderFormData = [
  {
    name: "nama_masjid",
    label: "Nama Masjid",
    placeholder: "Nama Masjid",
  },
  {
    name: "nama_ketua_dkm",
    label: "Nama Ketua DKM",
    placeholder: "Nama Ketua DKM",
  },
  {
    name: "no_hp",
    label: "No HP",
    placeholder: "No HP",
  },
] as const;

export function AddMasjidForm({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (data: {
    nama_masjid: string;
    nama_ketua_dkm: string;
    no_hp: string;
  }) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof masjidFormSchema>>({
    resolver: zodResolver(masjidFormSchema),
    defaultValues: {
      nama_masjid: "",
      nama_ketua_dkm: "",
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
          <DialogTitle>Tambah Data Masjid</DialogTitle>
          <DialogDescription>
            Input data masjid yang akan ditambahkan
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
