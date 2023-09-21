import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import useSession from "./account";
import { BASE_URL } from "@/lib/constants";

export function useCRUD<T>({
  shouldGetData = true,
  url,
  params,
}: {
  shouldGetData?: boolean;
  url: string;
  params?: Record<string, string>;
}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const { account } = useSession();

  const get = useCallback(() => {
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

  function reload() {
    get();
  }

  function create(data: unknown) {
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
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
      });
  }

  function update(data: T) {
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
  }

  function remove(id: string) {
    setLoading(true);
    fetch(`${BASE_URL}/api${url}/${id}`, {
      headers: {
        Authorization: `Bearer ${account?.accessToken}`,
      },
      method: "DELETE",
    })
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
  }

  useEffect(() => {
    if (!shouldGetData) {
      return;
    }
    get();
    setLoading(true);
  }, [account?.accessToken, get, params, shouldGetData, toast, url]);

  return { data, error, loading, create, update, remove, reload };
}
