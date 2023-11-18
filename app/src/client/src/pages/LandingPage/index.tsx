import { useState } from "react";
import Logo from "@/assets/logo";
import PengajianCalendar from "./pengajianCalendar";
import LandingPageJadwalJumatan from "./landingPageJumatan";

export default function LandingPage() {
  const [selectedJadwal, setSelectedJadwal] = useState<string>("Pengajian");
  const jadwal = ["Pengajian", "Jumatan"];

  return (
    <div className="w-full p-8 xl:px-32">
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center rounded-lg text-slate-900">
          <Logo className="w-9 h-9" />
          <span className="ml-1 text-base font-semibold">Broadcast</span>
        </div>
        <div className="flex flex-row">
          {jadwal.map((item, index) => (
            <div
              key={index}
              className={`px-4 py-2 text-base font-semibold rounded-lg ${
                selectedJadwal === item
                  ? "bg-green-700 text-white"
                  : "bg-white text-slate-900"
              }`}
              onClick={() => setSelectedJadwal(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      {selectedJadwal === "Pengajian" ? (
        <PengajianCalendar />
      ) : (
        <LandingPageJadwalJumatan />
      )}
    </div>
  );
}
