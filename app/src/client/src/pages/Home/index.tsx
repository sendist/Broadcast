import Logo from "@/assets/logo";
import { useWindowSize } from "usehooks-ts";
import { getPreferencesFromLocalStorage } from "@/lib/preferences";


export default function Home() {
  const { width } = useWindowSize();

  const preferences = getPreferencesFromLocalStorage();
  const appName = preferences.app_name;
  const logoImg = preferences.logo_img;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Logo imagePath={logoImg} className="w-9 h-9" />
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
