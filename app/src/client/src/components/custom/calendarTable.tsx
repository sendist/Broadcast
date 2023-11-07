import { Divide } from "lucide-react";

type Props = {
  year: number;
  month: number;
  jadwals: {
    tanggal: number;
    pengajians: {
      waktu: string;
      masjid: string;
      mubaligh: string;
    }[];
  }[];
};

const calendarTable = ({ year, month, jadwals }: Props) => {
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <div className="container mx-auto mt-10">
      <div className="wrapper bg-white rounded shadow w-full border-2">
        <div className="header flex justify-between border-b p-2">
          <span className="text-lg font-bold">
            {year + " " + monthName[month]}
          </span>
        </div>
        <div className="grid grid-cols-7">
          {[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].map((day, index) => (
            <div
              key={index}
              className="p-2 border h-full w-full xl:text-sm text-xs"
            >
              <span className="xl:block lg:block md:block sm:block hidden">
                {day}
              </span>
              <span className="xl:hidden lg:hidden md:hidden sm:hidden block">
                {day.slice(0, 3)}
              </span>
            </div>
          ))}
          {jadwals.map((jadwal) => (
            <div
              key={jadwal.tanggal}
              className="border p-1 h-full w-full overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300"
            >
              <div className="flex flex-col h-40 w-full mx-auto overflow-hidden">
                <div className="top h-full w-full flex flex-col justify-between">
                  <p className="text-gray-500">{jadwal.tanggal}</p>
                  <div>
                    {jadwal.pengajians.length > 0 && (
                      <span className="text-gray-500">
                        {jadwal.pengajians[0].waktu}
                      </span>
                    )}
                  </div>
                </div>
                {/* <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default calendarTable;
