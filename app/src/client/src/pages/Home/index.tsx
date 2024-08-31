import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import JumatanTable from "./jumatanTable";
import PengajianTable from "./pengajianTable";

export default function Home() {
  const [selectedJadwal, setSelectedJadwal] = useState<string>("Pengajian");
  const jadwal = ["Pengajian", "Jumatan"];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4  items-start gap-4 sm:gap-0">
        <div>
          <h1 className="inline-block text-xl font-semibold">
            Upcoming Broadcast
          </h1>
          <p className="text-sm text-muted-foreground">
            Jadwal pengajian dan jumatan untuk 3 hari ke depan
          </p>
        </div>
        <div>
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
        <PengajianTable />
      ) : (
        <JumatanTable />
      )}
    </div>
  );
}
