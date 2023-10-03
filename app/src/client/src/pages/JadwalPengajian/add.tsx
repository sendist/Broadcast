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
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

const jadwalPengajianFormSchema = z.object({
  tanggal: z.date({
    required_error: "Tanggal pengajian harus diisi",
  }),
  waktu: z.string().nonempty({
    message: "Waktu pengajian harus diisi",
  }),
  id_masjid: z
    .string()
    .nonempty({
      message: "Kode masjid harus diisi",
    })
    .transform((value) => parseInt(value, 10)),
  id_mubaligh: z
    .string()
    .nonempty({
      message: "Kode mubaligh harus diisi",
    })
    .transform((value) => parseInt(value, 10)),
});

const renderFormData = [
  {
    name: "waktu",
    label: "Waktu Pengajian",
    placeholder: "Waktu Pengajian",
  },
  {
    name: "id_masjid",
    label: "Kode Masjid",
    placeholder: "Kode Masjid",
  },
  {
    name: "id_mubaligh",
    label: "Kode Mubaligh",
    placeholder: "Kode Mubaligh",
  },
] as const;

export function AddJadwalPengajianForm({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (data: {
    tanggal: Date;
    waktu: string;
    id_masjid: number;
    id_mubaligh: number;
  }) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof jadwalPengajianFormSchema>>({
    resolver: zodResolver(jadwalPengajianFormSchema),
    defaultValues: {
      waktu: "",
    },
  });

// TODO MEY BUAT DROPDOWN

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Data Jadwal Pengajian</DialogTitle>
          <DialogDescription>
            Input data jadwal pengajian yang akan ditambahkan
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
            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Pengajian</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date); 
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
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
