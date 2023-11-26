import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "../ui/scroll-area";
import { RenderFormInput } from "./formDialog";

type Props<T extends FieldValues> = {
  title: string;
  subtitle: string;
  onSubmit: (data: T) => void;
  form: UseFormReturn<T, unknown, undefined>;
  renderFormInput: RenderFormInput<T>;
};

export default function FormDialogContent<T extends FieldValues>({
  title,
  subtitle,
  onSubmit,
  form,
  renderFormInput: renderFormData,
}: Props<T>) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{subtitle}</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
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
                  <FormLabel className="flex flex-row gap-2">
                    {item.label}{" "}
                    {item.guide && (
                      <HoverCard>
                        <HoverCardTrigger>
                          <InfoCircledIcon />
                        </HoverCardTrigger>
                        <HoverCardContent side="right">
                          <ScrollArea className="max-h-64">
                            {item.guide}
                          </ScrollArea>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </FormLabel>
                  {item.description && (
                    <FormDescription>{item.description}</FormDescription>
                  )}
                  <FormControl>
                    {item.textarea ? (
                      <Textarea placeholder={item.placeholder} {...field} />
                    ) : item.customInput ? (
                      <item.customInput field={field} />
                    ) : (
                      <Input
                        placeholder={item.placeholder}
                        {...field}
                        type={item.type}
                      />
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
  );
}
