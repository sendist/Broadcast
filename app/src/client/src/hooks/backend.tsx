import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import useSession from "./account";
import { BASE_URL } from "@/lib/constants";

export function useCRUD<T>({
  initialGet = true,
  url,
  params,
}: {
  initialGet?: boolean;
  url: string;
  params?: Record<string, string>;
}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const { account } = useSession();

  const get = useCallback(() => {
    setLoading(true);
    fetch(
      `${BASE_URL}/api${url}${params ? "?" + new URLSearchParams(params) : ""}`,
      {
        headers: {
          Authorization: `Bearer ${account?.accessToken}`,
        },
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data: { error: string; data: T }) => {
        setLoading(false);
        if (data.error) {
          setError(data.error);
          toast({
            title: "Error",
            description: data.error,
          });
          return;
        }
        setData(data.data);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
      });
  }, [account?.accessToken, params, toast, url]);

  function create(data: unknown, refresh = true) {
    setLoading(true);
    fetch(`${BASE_URL}/api${url}`, {
      headers: {
        Authorization: `Bearer ${account?.accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data: { error: string; data: unknown }) => {
        setLoading(false);
        if (data.error) {
          setError(data.error);
          toast({
            title: "Error",
            description: data.error,
          });
          return;
        }
        refresh && get();
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
      });
  }

  function update(data: unknown, refresh = true) {
    setLoading(true);
    fetch(
      `${BASE_URL}/api${url}${params ? "?" + new URLSearchParams(params) : ""}`,
      {
        headers: {
          Authorization: `Bearer ${account?.accessToken}`,
        },
        method: "PUT",
        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then((data: { error: string; data: unknown }) => {
        setLoading(false);
        if (data.error) {
          setError(data.error);
          toast({
            title: "Error",
            description: data.error,
          });
          return;
        }
        refresh && get();
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
      });
  }

  function remove(id: unknown, refresh = true) {
    setLoading(true);
    fetch(`${BASE_URL}/api${url}/${id}`, {
      headers: {
        Authorization: `Bearer ${account?.accessToken}`,
      },
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data: { error: string; data: unknown }) => {
        setLoading(false);
        if (data.error) {
          setError(data.error);
          toast({
            title: "Error",
            description: data.error,
          });
          return;
        }
        refresh && get();
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
      });
  }

  useEffect(() => {
    if (!initialGet) {
      return;
    }
    get();
  }, [account?.accessToken, get, params, initialGet, toast, url]);

  return { data, error, loading, create, update, remove, get };
}

export function useServerAction() {
  const { toast } = useToast();
  const { account } = useSession();

  const serverAction = useCallback(
    (
      input: RequestInfo | URL,
      methodAndData?: {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        data?: object;
      }
    ) =>
      fetch(`${BASE_URL}/api${input}`, {
        headers: {
          Authorization: `Bearer ${account?.accessToken}`,
        },
        method: methodAndData?.method || "GET",
        body: methodAndData?.data
          ? JSON.stringify(methodAndData.data)
          : undefined,
      })
        .then((res) => res.json())
        .then(({ error, data }) => {
          if (error) {
            toast({
              title: "Error",
              description: error,
            });
            return null;
          }
          return data;
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err.message,
          });
          console.log(err);
          return null;
        }),
    [account?.accessToken, toast]
  );
  return serverAction;
}
