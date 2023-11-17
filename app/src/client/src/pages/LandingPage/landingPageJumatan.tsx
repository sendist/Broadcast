import { useCRUD } from "@/hooks/backend";
import { useEffect, useState } from "react";
import { useIsFirstRender } from "usehooks-ts";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/ui/table";
import MonthPicker from "@/components/custom/month-picker";

type Jadwal = {
    jadwalPengajians: {
      tanggal: string;
      waktu: string;
      masjid: { nama_masjid: string };
      mubaligh: { nama_mubaligh: string };
    }[],
    jadwalJumatans : {
      tanggal: string;
      masjid: { nama_masjid: string };
      mubaligh: { nama_mubaligh: string };
    }[]
  };

export default function LandingPageJadwalJumatan() {
  const [date, setDate] = useState(new Date());
  const isFirstRender = useIsFirstRender();
  const dateArr: Date[] = [];
  const endDateThisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDateThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  for (
    let i = startDateThisMonth;
    i < endDateThisMonth;
    i = new Date(i.setDate(i.getDate() + 1))
  ) {
    dateArr.push(new Date(i));
  }
  while (dateArr[0].getDay() !== 0) {
    dateArr.unshift(
      new Date(
        dateArr[0].getFullYear(),
        dateArr[0].getMonth(),
        dateArr[0].getDate() - 1
      )
    );
  }
  while (dateArr[dateArr.length - 1].getDay() !== 6) {
    dateArr.push(
      new Date(
        dateArr[dateArr.length - 1].getFullYear(),
        dateArr[dateArr.length - 1].getMonth(),
        dateArr[dateArr.length - 1].getDate() + 1
      )
    );
  }

  const getFridaysInMonth = (currentDate: Date) => {
    const currentMonth = currentDate.getMonth();
    const fridaysInMonth = [];

    let firstDayOfMonth = new Date(currentDate.getFullYear(), currentMonth, 1);
    let currentDateIterator = new Date(firstDayOfMonth);

    while (currentDateIterator.getMonth() === currentMonth) {
      if (currentDateIterator.getDay() === 5) {
        fridaysInMonth.push(new Date(
          currentDateIterator.getFullYear(),
          currentDateIterator.getMonth(),
          currentDateIterator.getDate()
        ));
      }
      currentDateIterator.setDate(currentDateIterator.getDate() + 1);
    }

    return fridaysInMonth;
  };

  const [fridays, setFridays] = useState(getFridaysInMonth(date));

  const { data, loading, get } = useCRUD<Jadwal>({
    url: "/landing",
    params: {
      dateStart: dateArr[0].toISOString(),
      dateEnd: dateArr[dateArr.length - 1].toISOString(),
    },
  });

  useEffect(() => {
    if (!isFirstRender) {
      get();
    }
  }, [date]);

  const jadwalJumatan: {
    masjid: string;
    jumatans: {
      tanggal: Date;
      mubaligh: string;
    }[];
  }[] = [];

  if (!loading && data) {
    const masjidArr: string[] = [];

    for (let i = 0; i < data.jadwalJumatans.length; i++) {
      const masjidName = data.jadwalJumatans[i].masjid.nama_masjid;
      if (!masjidArr.includes(masjidName)) {
        masjidArr.push(masjidName);
      }
    }

    console.log(data.jadwalJumatans)
    for (let i = 0; i < masjidArr.length; i++) {
      let filteredData = data.jadwalJumatans.filter(
        (jumatan) => jumatan.masjid.nama_masjid === masjidArr[i]
      );
      jadwalJumatan.push({
        masjid: masjidArr[i],
        jumatans: filteredData.map((jumatan) => ({
          tanggal: jumatan.tanggal,
          mubaligh: jumatan.mubaligh.nama_mubaligh,
        })),
      });
      filteredData = [];
    }
  }

  const handleMonthChange = (newDate: Date) => {
    setDate(newDate)
    setFridays(getFridaysInMonth(newDate));
  };

  return (
    <div>
      <div className="mb-4">
        <MonthPicker onUpdate={handleMonthChange} />
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-3 text-xs md:text-sm">Masjid</TableHead>
              {fridays.map((friday, index) => (
                <TableHead key={index} className="p-3 text-xs md:text-sm">{friday.toLocaleDateString('id-ID')}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {jadwalJumatan.length > 0 ? (
              jadwalJumatan.map((jadwal, index) => (
                <TableRow key={index}>
                  <TableCell key={index} className="p-3 text-xs md:text-sm">{jadwal.masjid}</TableCell>
                  {fridays.map((friday, index) => (
                    <TableCell key={index} className="p-3 text-xs md:text-sm">
                      {jadwal.jumatans.map((jumatan) => (
                        friday.getDate() === new Date(jumatan.tanggal).getDate() && (
                          <span key={index}>{jumatan.mubaligh}</span>
                        )
                      ))}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={fridays.length + 1} className="h-24 text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
