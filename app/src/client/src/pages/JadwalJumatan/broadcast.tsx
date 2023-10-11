import { BroadcastPopover } from "@/components/custom/broadcastPopover";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";
import { useState } from "react";

type Props = {
  idJadwal: string;
  children: React.ReactNode;
  template: {
    id: string;
    content: string;
    nama_template: string;
  }[];
};

export default function Broadcast({ idJadwal, children, template }: Props) {
  const [idTemplate, setIdTemplate] = useState<string>("");
  const [templatePreview, setTemplatePreview] = useState<string[]>([]);
  const apiFetch = useApiFetch();
  function changeIdTemplate(id: string) {
    setIdTemplate(id);
    apiFetch<string[]>({
      url: `${BASE_URL}/jadwal-jumatan/broadcast-preview?${new URLSearchParams({
        id: idJadwal,
        template: id,
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
      idTemplate={idTemplate}
      setIdTemplate={changeIdTemplate}
      previewTexts={templatePreview}
      onSend={() =>
        apiFetch({
          url:
            BASE_URL +
            "/jadwal-jumatan/broadcast?" +
            new URLSearchParams({
              id: idJadwal,
              template: idTemplate,
            }).toString(),
        })
      }
    >
      {children}
    </BroadcastPopover>
  );
}
