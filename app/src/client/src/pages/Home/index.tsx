import Logo from "@/assets/logo";
import { useWindowSize } from "usehooks-ts";

export default function Home() {
  const { width } = useWindowSize();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Logo className="w-20 h-20 mb-8" />
      <p className="text-lg">
        Selamat Datang di <span className="font-semibold">Broadcast</span>
      </p>
      <p className="text-sm text-muted-foreground text-center">
        Untuk memulai, silakan pilih menu yang tersedia pada{" "}
        <span className="font-medium">
          {width > 1024 ? "sidebar" : "hamburger icon"}
        </span>
        .
      </p>
    </div>
  );
}
