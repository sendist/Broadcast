import { useContext } from "react";
import { CustomizationContext } from "@/context/customization";

const useCustomization = () => {
  return useContext(CustomizationContext);
};

export default useCustomization;
