import Logo from "@/assets/logo";

// import { DataTable } from "@/components/ui/data-table";
// import { Table as TableType, Row, SortingState } from "@tanstack/react-table";
// import { JadwalJumatan, columns } from "./columns";
// import { useCRUD } from "@/hooks/backend";
// import { useApiFetch } from "@/hooks/fetch";
// import { BASE_URL } from "@/lib/constants";
// import { useEffect, useRef, useState } from "react";
// import Broadcast from "./broadcast";
// import useFirstRender from "@/hooks/firstRender";
// import { DateRangePicker } from "@/components/ui/date-range-picker";



export default function LandingPage() {
  return (
    <div className="w-screen h-screen grid">
      <div className="flex flex-col gap-4 justify-stretch p-4">
        <div className="mb-4 flex flex-col items-center rounded-lg px-3 py-2 text-slate-900">
          <Logo className="w-20 h-20" />
          <span className="ml-1 text-xl font-semibold mt-4">Broadcast</span>
          <span className="ml-1 text-sm text-muted-foreground">
            Ini Landing Page untuk Jadwal
          </span>
        </div>
      </div>
    </div>
  );
}
