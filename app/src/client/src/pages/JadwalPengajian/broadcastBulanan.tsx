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
  const [idTemplate, setIdTemplate] = useState<string>("");
  const [templatePreview, setTemplatePreview] = useState<PreviewTextType[]>([]);
  const [month, setMonth] = useState<string>(new Date().getMonth().toString());
  const apiFetch = useApiFetch();
  const months = [
    { id: 0, name: "Januari" },
    { id: 1, name: "Februari" },
    { id: 2, name: "Maret" },
    { id: 3, name: "April" },
    { id: 4, name: "Mei" },
    { id: 5, name: "Juni" },
    { id: 6, name: "Juli" },
    { id: 7, name: "Agustus" },
    { id: 8, name: "September" },
    { id: 9, name: "Oktober" },
    { id: 10, name: "November" },
    { id: 11, name: "Desember" },
  ];

  function changeMonth(month: string) {
    setMonth(month);
    apiFetch<PreviewTextType[]>({
      url: `${BASE_URL}/jadwal-pengajian/broadcast-bulanan-preview?${new URLSearchParams(
        {
          template: idTemplate,
          month: month,
        }
      ).toString()}`,
    }).then((res) => {
      setTemplatePreview(res?.data || []);
    });
  }

  function changeIdTemplate(id: string) {
    setIdTemplate(id);
    apiFetch<PreviewTextType[]>({
      url: `${BASE_URL}/jadwal-pengajian/broadcast-bulanan-preview?${new URLSearchParams(
        {
          template: id,
          month: month,
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
      bulanan={{
        selectMonth: months.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        })),
        month: month,
        setMonth: changeMonth,
      }}
      idTemplate={idTemplate}
      setIdTemplate={changeIdTemplate}
      previewTexts={templatePreview}
      onSend={() =>
        apiFetch({
          url:
            BASE_URL +
            "/jadwal-pengajian/broadcast-bulanan?" +
            new URLSearchParams({
              template: idTemplate,
              month: month,
            }).toString(),
        })
      }
    >
      {children}
    </BroadcastPopover>
  );
}
