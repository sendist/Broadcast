import CalendarTable from "@/components/custom/calendarTable";
import { useCRUD } from "@/hooks/backend";

type Jadwal = {
  tanggal: number;
  pengajians: {
    waktu: string;
    masjid: string;
    mubaligh: string;
  }[];
};
export default function LandingPage() {
  const { data, loading, update, remove, create, get } =
    useCRUD<Jadwal>({
      url: "/landing",
      // params: {
      //   dateStart: new Date(
      //     new Date().setHours(new Date().getTimezoneOffset() / -60)
      //   ).toISOString(),
      //   dateEnd: new Date(
      //     new Date().setHours(new Date().getTimezoneOffset() / -60)
      //   ).toISOString(),
      // },
    });
  console.log(data);
  return (
    <div className="w-full p-8">
      {data && <CalendarTable year={2023} month={0} jadwals={data} />}
    </div>
  );
}
