import React from "react";
import { Table, TableBody, TableHeader } from "./table";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface EventProps {
  jadwal: string;
  masjid: string;
  mubaligh: string;
  waktu?: string;
}

const EventDetail: React.FC<EventProps> = ({
  jadwal,
  masjid,
  mubaligh,
  waktu,
}) => (
  <Card className="border-border border shadow-none">
    <CardHeader>
      <CardTitle>{jadwal}</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
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
