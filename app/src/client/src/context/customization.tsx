import { createContext, useEffect, useState } from "react";
import { BASE_URL } from "@/lib/constants";
import { useApiFetch } from "@/hooks/fetch";

const CustomizationContext = createContext<{
  appLogo: string;
  appName: string;
  setAppLogo: (logo: string) => void;
  setAppName: (name: string) => void;
}>({
  appLogo: "default-logo.svg",
  appName: "Broadcast",
  setAppLogo: () => {},
  setAppName: () => {},
});

type CustomizationProviderProps = {
  children: React.ReactNode;
};

const CustomizationProvider = ({ children }: CustomizationProviderProps) => {
  const [appLogo, setAppLogo] = useState("");
  const [appName, setAppName] = useState("Broadcast");

  const apiFetch = useApiFetch();

  function getCustomizations() {
    apiFetch<{
      app_name: string;
      app_logo: string;
    }>({
      url: `${BASE_URL}/public/customizations`,
    }).then((res) => {
      if (res?.error) {
        return;
      }
      res?.data?.app_name && setAppName(res.data.app_name);
      res?.data?.app_logo && setAppLogo(res.data.app_logo);
    });
  }

  useEffect(() => {
    getCustomizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CustomizationContext.Provider
      value={{ appLogo, appName, setAppLogo, setAppName }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export { CustomizationContext, CustomizationProvider };
