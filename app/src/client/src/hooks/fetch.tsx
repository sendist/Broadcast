import { toast } from "@/components/ui/use-toast";
import useSession from "./account";
import { useEffect, useRef } from "react";

export function useApiFetch() {
  const cancelRequest = useRef<boolean>(false);

  const { account, refresh } = useSession();
  const tokenExpiredHandler = async <T,>(
    url: string,
    options?: Omit<RequestInit, "headers">
  ) => {
    const refreshedAccount = await refresh();
    if (refreshedAccount === false) {
      return;
    }
    return apiFetch<T>({
      url,
      options,
      accessToken: refreshedAccount.accessToken,
    });
  };

  const apiFetch = async <T,>({
    url,
    options,
    accessToken,
  }: {
    url: string;
    options?: RequestInit;
    accessToken?: string;
  }): Promise<
    | {
        error: string;
        data: null;
      }
    | {
        error: null;
        data: T;
      }
    | undefined
  > => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken ?? account?.accessToken}`,
          ...options?.headers,
        },
      });
      // handle token expired
      if (response.status === 401) {
        return await tokenExpiredHandler<T>(url, options);
      }

      //check if the response is file, if it is, download it
      if (response.headers.get("Content-Disposition")?.includes("attachment")) {
        const file = await response.blob();
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          response.headers
            .get("Content-Disposition")
            ?.split("filename=")[1]
            .replace(/"/g, "") || "file";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return;
      }

      //continue parse the response as json
      const data = (await response.json()) as { error: string; data: T };
      if (cancelRequest.current) return;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
        });

        return { error: data.error, data: null };
      } else {
        return { error: null, data: data.data };
      }
    } catch (error) {
      if (cancelRequest.current) return;

      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }

      toast({
        title: "Error",
        description: message,
      });

      return { error: message, data: null };
    }
  };

  useEffect(() => {
    cancelRequest.current = false;

    return () => {
      cancelRequest.current = true;
    };
  }, []);

  return apiFetch;
}
