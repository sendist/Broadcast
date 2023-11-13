import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import EventDetail from "./event-detail";
import { formatDate } from "@/lib/utils";

type EventData = {
  masjid: string;
  mubaligh: string;
  waktu?: string;
};

type Props = {
  children: React.ReactNode;
  tanggal: Date;
  eventData: EventData[];
};

export default function EventDialog({ children, tanggal, eventData }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formatDate(tanggal)}</DialogTitle>
        </DialogHeader>
        {eventData.map((event)=>(
          <EventDetail jadwal="Pengajian" masjid={event.masjid} mubaligh={event.mubaligh} waktu={event.waktu} />
        ))}
      </DialogContent>
    </Dialog>
  );
}
