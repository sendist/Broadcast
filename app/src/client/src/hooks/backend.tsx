import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import useSession from "./account";
import { BASE_URL } from "@/lib/constants";
import { isStringJson } from "@/lib/utils";

export function checkTokenExpired(
  error: string,
  refresh: () => Promise<boolean>,
  redoFunction: () => void
) {
  if (error === "TokenExpiredError") {
    return refresh().then((successRefresh) => {
      successRefresh && redoFunction();
      return successRefresh;
    });
  }
  return Promise.resolve(false);
}

// TODO: check for bug in checkTokenExpired

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
  const { account, refresh } = useSession();

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
          checkTokenExpired(data.error, refresh, get).then((successRefresh) => {
            if (!successRefresh) {
              setError(data.error);
              toast({
                title: "Error",
                description: data.error,
              });
            }
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
  }, [account?.accessToken, params, refresh, toast, url]);

  function create(data: unknown, shouldRefresh = true) {
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
          checkTokenExpired(data.error, refresh, () =>
            create(data, shouldRefresh)
          ).then((successRefresh) => {
            if (!successRefresh) {
              setError(data.error);
              toast({
                title: "Error",
                description: data.error,
              });
            }
          });
          return;
        }
        shouldRefresh && get();
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
      });
  }

  function update(data: unknown, shouldRefresh = true) {
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
          checkTokenExpired(data.error, refresh, () =>
            update(data, shouldRefresh)
          ).then((successRefresh) => {
            if (!successRefresh) {
              setError(data.error);
              toast({
                title: "Error",
                description: data.error,
              });
            }
          });
          return;
        }
        shouldRefresh && get();
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
      });
  }

  function remove(id: unknown, shouldRefresh = true) {
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
          checkTokenExpired(data.error, refresh, () =>
            create(data, shouldRefresh)
          ).then((successRefresh) => {
            if (!successRefresh) {
              setError(data.error);
              toast({
                title: "Error",
                description: data.error,
              });
            }
          });
          return;
        }
        shouldRefresh && get();
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
  const { account, refresh } = useSession();

  const serverAction = useCallback(
    (
      url: RequestInfo | URL,
      methodAndData?: {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        data?: object;
      }
    ) =>
      fetch(`${BASE_URL}/api${url}`, {
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
            checkTokenExpired(data.error, refresh, () =>
              serverAction(url, methodAndData)
            ).then((successRefresh) => {
              if (!successRefresh) {
                toast({
                  title: "Error",
                  description: error,
                });
              }
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
    [account?.accessToken, refresh, toast]
  );
  return serverAction;
}

export function useWebSocket<T>(url: string, tokenUrl: string) {
  //request token from tokenUrl
  const { data } = useCRUD<{ token: string }>({
    url: tokenUrl,
  });
  const [lastJsonMessage, setLastJsonMessage] = useState<T | null>(null);
  const [lastMessage, setLastMessage] = useState<MessageEvent["data"] | null>(
    null
  );
  const [ws, setWs] = useState<WebSocket | null>(null);
  useEffect(() => {
    if (data) {
      const ws = new WebSocket(
        `${BASE_URL.replace(/^http/, "ws")}/api${url}?token=${data.token}`
      );
      setWs(ws);
      ws.onmessage = (e) => {
        setLastMessage(e.data);
        const json = isStringJson(e.data);
        json && setLastJsonMessage(json);
      };
      ws.onclose = (e) => {
        console.log(e);
      };
      ws.onerror = (e) => {
        console.log(e);
      };
    }
  }, [data, url]);

  function sendMessage(message: string) {
    if (ws) {
      ws.send(message);
    }
  }
  return { lastJsonMessage, lastMessage, sendMessage };
}
