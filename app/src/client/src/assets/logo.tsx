import useCustomization from "@/hooks/customization";
import { ImgHTMLAttributes } from "react";

export default function Logo({
  className,
  src,
}: {
  className?: string;
  src?: ImgHTMLAttributes<HTMLImageElement>["src"];
}) {
  const { appLogo } = useCustomization();
  return <img className={className} src={src || appLogo} alt="Logo" />;
}
