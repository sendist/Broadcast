import { useState } from "react";
import Logo from "@/assets/logo";
import PengajianCalendar from "./pengajianCalendar";
import LandingPageJadwalJumatan from "./landingPageJumatan";
import useCustomization from "@/hooks/customization";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [selectedJadwal, setSelectedJadwal] = useState<string>("Pengajian");
  const jadwal = ["Pengajian", "Jumatan"];
  const { appName } = useCustomization();

  return (
    <div className="w-full p-8 xl:px-32">
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center rounded-lg text-slate-900">
          <Logo className="w-12 h-12" />
          <span className="ml-1 text-base font-semibold">{appName}</span>
        </div>
        <div className="flex flex-row">
          {jadwal.map((item, index) => (
            <Button
              key={index}
              className={cn(selectedJadwal === item && "pointer-events-none")}
              variant={selectedJadwal === item ? "default" : "ghost"}
              onClick={() => setSelectedJadwal(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      {selectedJadwal === "Pengajian" ? (
        <PengajianCalendar />
      ) : (
        <LandingPageJadwalJumatan />
      )}

      <div className="mt-10 flex flex-wrap items-center text-xs md:text-sm text-gray-400 justify-center text-center">
        <p>
          &copy; Pancaswastamita - Politeknik Negeri Bandung
        </p>
      </div>
    </div>
  );
}
