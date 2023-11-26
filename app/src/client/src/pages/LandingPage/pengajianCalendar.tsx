import { useEffect, useState } from "react";
import { useCRUD } from "@/hooks/backend";
import EventDialog from "@/components/custom/event-dialog";
import Event from "@/components/custom/event";
import { useIsFirstRender } from "usehooks-ts";
import { useWindowSize } from "@/hooks/windowSize";
import EventDetail from "@/components/custom/event-detail";
import { formatDate } from "@/lib/utils";
import MonthPicker from "@/components/custom/month-picker";

type Jadwal = {
  tanggal: string;
  waktu: string;
  masjid: { nama_masjid: string };
  mubaligh: { nama_mubaligh: string };
};
export default function PengajianCalendar() {
  const [date, setDate] = useState(new Date());
  const isFirstRender = useIsFirstRender();

  const dateArr: Date[] = [];
  const endDateThisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDateThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const { width } = useWindowSize();

  const [numOfDisplayedEvent, setNumOfDisplayedEvent] = useState(1);

  const [selectedJadwalType, setSelectedJadwalType] =
    useState<string>("Calendar");
  const jadwalType = ["Calendar", "List"];

  useEffect(() => {
    if (width >= 640) {
      setNumOfDisplayedEvent(2);
    } else {
      setNumOfDisplayedEvent(1);
    }
  }, [width]);

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

  const { data, loading, get } = useCRUD<Jadwal>({
    url: "/landing",
    params: {
      dateStart: dateArr[0].toISOString(),
      dateEnd: dateArr[dateArr.length - 1].toISOString(),
      jadwalType: "pengajian",
    },
  });
  useEffect(() => {
    if (!isFirstRender) {
      get();
    }
  }, [date]);

  const jadwalPengajian: {
    tanggal: Date;
    isDateInThisMonth: boolean;
    pengajians: {
      waktu: string;
      masjid: string;
      mubaligh: string;
    }[];
  }[] = [];

  if (!loading && data) {
    for (let i = 0; i < dateArr.length; i++) {
      let filteredData = data.filter(
        (pengajian) =>
          new Date(pengajian.tanggal as string).setHours(0, 0, 0, 0) ===
          dateArr[i].setHours(0, 0, 0, 0)
      );
      jadwalPengajian.push({
        tanggal: dateArr[i],
        isDateInThisMonth: dateArr[i].getMonth() === date.getMonth(),
        pengajians: filteredData.map((pengajian) => ({
          waktu: pengajian.waktu,
          masjid: pengajian.masjid.nama_masjid,
          mubaligh: pengajian.mubaligh.nama_mubaligh,
        })),
      });
      filteredData = [];
    }
  }

  const handleNextMonth = () => {
    setDate(new Date(date.setMonth(date.getMonth() + 1)));
  };

  const handlePreviousMonth = () => {
    setDate(new Date(date.setMonth(date.getMonth() - 1)));
  };

  const handleMonthChange = (newDate: Date) => {
    setDate(newDate);
  };

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
    <>
      {data && (
        <div className=" mx-auto mt-6">
          {width >= 768 && (
            <div className="flex flex-row mb-2">
              {jadwalType.map((item, index) => (
                <p
                  key={index}
                  className={`px-3 py-1 text-sm font-semibold rounded-md ${
                    selectedJadwalType === item
                      ? "bg-green-700 text-white"
                      : "bg-white text-slate-900"
                  }`}
                  onClick={() => setSelectedJadwalType(item)}
                >
                  {item}
                </p>
              ))}
            </div>
          )}
          {selectedJadwalType === "Calendar" && width >= 768 ? (
            <div className="wrapper bg-white rounded shadow w-full border border-slate-400">
              <div className="header flex justify-between border-b p-2">
                <span className="md:text-lg font-bold">
                  {date.getFullYear() + " " + monthName[date.getMonth()]}
                </span>
                <div className="buttons">
                  <button className="p-1" onClick={handlePreviousMonth}>
                    <svg
                      width="1em"
                      height="1em"
                      viewBox="0 0 16 16"
                      className="bi bi-arrow-left-circle"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M8.354 11.354a.5.5 0 0 0 0-.708L5.707 8l2.647-2.646a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M11.5 8a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5z"
                      />
                    </svg>
                  </button>
                  <button className="p-1" onClick={handleNextMonth}>
                    <svg
                      width="1em"
                      height="1em"
                      viewBox="0 0 16 16"
                      className="bi bi-arrow-right-circle"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M7.646 11.354a.5.5 0 0 1 0-.708L10.293 8 7.646 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M4.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"
                      />
                    </svg>
                  </button>
                </div>
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
                {jadwalPengajian.map((jadwal) => (
                  <div
                    key={jadwal.tanggal.toISOString()}
                    className={`border p-1 h-full w-full overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300 ${
                      !jadwal.isDateInThisMonth && "bg-gray-100"
                    }`}
                  >
                    <EventDialog
                      tanggal={jadwal.tanggal}
                      eventData={jadwal.pengajians}
                    >
                      <div className="flex flex-col h-20 sm:h-40 w-full mx-auto overflow-hidden">
                        <div className="top h-full w-full">
                          <p className="text-gray-500 md:mb-4 p-2 text-xs md:text-base">
                            {jadwal.tanggal.getDate()}
                          </p>

                          <div className="px-1">
                            {jadwal.pengajians
                              .slice(0, numOfDisplayedEvent)
                              .map((pengajian) => (
                                <Event masjid={pengajian.masjid} />
                              ))}
                            {jadwal.pengajians.length > 2 && (
                              <p className="sm:text-xs md:text-base text-[8px]">
                                {jadwal.pengajians.length - numOfDisplayedEvent}{" "}
                                more
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </EventDialog>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 mt-6 sm:mx-4 md:mx-12 lg:mx-28 xl:mx-60">
                <MonthPicker onUpdate={handleMonthChange} />
              </div>
              {jadwalPengajian.map((jadwal) => (
                <>
                  {jadwal.isDateInThisMonth && jadwal.pengajians.length > 0 && (
                    <div>
                      <div className="flex items-center sm:mx-4 md:mx-12 lg:mx-28 xl:mx-60">
                        <h1 className="font-semibold text-lg mb-2 mt-4 mr-4">
                          {formatDate(jadwal.tanggal)}
                        </h1>
                        <div className="flex-grow border-b border-slate-400 ml-2 mt-2"></div>
                      </div>
                      {jadwal.pengajians.map((pengajian) => (
                        <div className="mb-2 mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-64">
                          <EventDetail
                            masjid={pengajian.masjid}
                            mubaligh={pengajian.mubaligh}
                            waktu={pengajian.waktu}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
