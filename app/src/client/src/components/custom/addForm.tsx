import {
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export type RenderFormInput<T extends FieldValues> = {
  name: string;
  label: string;
  placeholder?: string;
  customInput?: (props: { field: ControllerRenderProps<T> }) => JSX.Element;
}[];

type Props<T extends FieldValues> = {
  title: string;
  subtitle: string;
  dialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;
  children: React.ReactNode;
  onSubmit: (data: T) => void;
  form: UseFormReturn<T, unknown, undefined>;
  renderFormInput: RenderFormInput<T>;
};

export default function AddForm<T extends FieldValues>({
  title,
  subtitle,
  dialogOpen,
  setDialogOpen,
  children,
  onSubmit,
  form,
  renderFormInput: renderFormData,
}: Props<T>) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
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
                name={item.name as Path<T>}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      {item.customInput ? (
                        <item.customInput field={field} />
                      ) : (
                        <Input placeholder={item.placeholder} {...field} />
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
