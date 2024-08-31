import {
  BroadcastPopover,
  PreviewTextType,
} from "@/components/custom/broadcastPopover";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";
import { useState } from "react";

type Props = {
  idJadwal: string[];
  children: React.ReactNode;
  template: {
    id: string;
    content: string;
    nama_template: string;
  }[];
};

export default function Broadcast({ idJadwal, children, template }: Props) {
  const apiFetch = useApiFetch();
  const [templatePreview, setTemplatePreview] = useState<PreviewTextType[]>([]);

  function refreshPreview(templates: {
    idTemplateDKM?: string;
    idTemplateMubaligh?: string;
  }) {
    apiFetch<PreviewTextType[]>({
      url: `${BASE_URL}/jadwal-jumatan/broadcast-preview?${new URLSearchParams({
        id: idJadwal.join(","),
        ...(templates.idTemplateDKM && {
          templateDKM: templates.idTemplateDKM,
        }),
        ...(templates.idTemplateMubaligh && {
          templateMubaligh: templates.idTemplateMubaligh,
        }),
      }).toString()}`,
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
      refreshPreview={refreshPreview}
      previewTexts={templatePreview}
      onSend={(templates) =>
        apiFetch({
          url:
            BASE_URL +
            "/jadwal-jumatan/broadcast?" +
            new URLSearchParams({
              id: idJadwal.join(","),
              ...(templates.idTemplateDKM && {
                templateDKM: templates.idTemplateDKM,
              }),
              ...(templates.idTemplateMubaligh && {
                templateMubaligh: templates.idTemplateMubaligh,
              }),
            }).toString(),
        })
      }
    >
      {children}
    </BroadcastPopover>
  );
}
