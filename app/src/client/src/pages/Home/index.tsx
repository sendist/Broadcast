import Logo from "@/assets/logo";
import useCustomization from "@/hooks/customization";
import { useWindowSize } from "usehooks-ts";

export default function Home() {
  const { width } = useWindowSize();
  const { appName } = useCustomization();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Logo className="w-16 h-16 mb-6" />
      <p className="text-lg">
        Selamat Datang di <span className="font-semibold">{appName}</span>
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
