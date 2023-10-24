import {
  BroadcastPopover,
  PreviewTextType,
} from "@/components/custom/broadcastPopover";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  template: {
    id: string;
    content: string;
    nama_template: string;
  }[];
};

export default function BroadcastBulanan({ children, template }: Props) {
  const [templatePreview, setTemplatePreview] = useState<PreviewTextType[]>([]);
  const apiFetch = useApiFetch();

  function refreshPreview(templates: {
    idTemplateDKM?: string;
    idTemplateMubaligh?: string;
    month?: string;
  }) {
    apiFetch<PreviewTextType[]>({
      url: `${BASE_URL}/jadwal-pengajian/broadcast-bulanan-preview?${new URLSearchParams(
        {
          ...(templates.idTemplateDKM && {
            templateDKM: templates.idTemplateDKM,
          }),
          ...(templates.idTemplateMubaligh && {
            templateMubaligh: templates.idTemplateMubaligh,
          }),
          month: templates.month!,
        }
      ).toString()}`,
    }).then((res) => {
      setTemplatePreview(res?.data || []);
    });
  }

  return (
    <BroadcastPopover
      select={template.map((item) => ({
        label: item.nama_template,
        value: item.id,
      }))}
      bulanan
      refreshPreview={refreshPreview}
      previewTexts={templatePreview}
      onSend={(templates: {
        idTemplateDKM?: string;
        idTemplateMubaligh?: string;
        month?: string;
      }) =>
        apiFetch({
          url:
            BASE_URL +
            "/jadwal-pengajian/broadcast-bulanan?" +
            new URLSearchParams({
              ...(templates.idTemplateDKM && {
                templateDKM: templates.idTemplateDKM,
              }),
              ...(templates.idTemplateMubaligh && {
                templateMubaligh: templates.idTemplateMubaligh,
              }),
              month: templates.month!,
            }).toString(),
        })
      }
    >
      {children}
    </BroadcastPopover>
  );
}
