import React from "react";
import { Table, TableBody, TableHeader } from "../ui/table";
import { Card, CardContent } from "../ui/card";

interface EventProps {
  masjid: string;
  mubaligh: string;
  waktu?: string;
}

const EventDetail: React.FC<EventProps> = ({
  masjid,
  mubaligh,
  waktu,
}) => (
  <Card className="border-border border shadow-none">
    <CardContent className="pt-5">
      <Table className="text-xs md:text-base">
        <TableHeader>
          <td className="w-40">Masjid</td>
          <td className="w-40">Mubaligh</td>
          {waktu ? <td>Waktu</td> : null}
        </TableHeader>
        <TableBody className="font-bold align-top">
          <td className="pe-2">{masjid}</td>
          <td className="pe-2">{mubaligh}</td>
          {waktu ? <td>{waktu}</td> : null}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default EventDetail;
