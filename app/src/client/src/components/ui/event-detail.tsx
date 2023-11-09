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
          <td>Masjid</td>
          <td>Mubaligh</td>
          {waktu ? <td>Waktu</td> : null}
        </TableHeader>
        <TableBody className="font-bold">
          <td>{masjid}</td>
          <td>{mubaligh}</td>
          {waktu ? <td>{waktu}</td> : null}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default EventDetail;
