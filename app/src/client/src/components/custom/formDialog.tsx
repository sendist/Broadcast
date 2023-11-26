import {
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import FormDialogContent from "./formDialogContent";

export type RenderFormInput<T extends FieldValues> = {
  name: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
  type?: React.HTMLInputTypeAttribute;
  customInput?: (props: { field: ControllerRenderProps<T> }) => JSX.Element;
  description?: string;
  guide?: JSX.Element | string;
}[];

type Props<T extends FieldValues> = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onSubmit: (data: T) => void;
  form: UseFormReturn<T, unknown, undefined>;
  renderFormInput: RenderFormInput<T>;
};

export default function FormDialog<T extends FieldValues>({
  title,
  subtitle,
  children,
  onSubmit,
  form,
  renderFormInput: renderFormData,
}: Props<T>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {children}
      </DialogTrigger>
      <FormDialogContent
        title={title}
        subtitle={subtitle}
        form={form}
        onSubmit={(data) => {
          setDialogOpen(false);
          onSubmit(data);
        }}
        renderFormInput={renderFormData}
      />
    </Dialog>
  );
}
