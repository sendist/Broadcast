import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import useSession from "./account";
import { BASE_URL } from "@/lib/constants";
import { isStringJson } from "@/lib/utils";
import { redirect } from "react-router-dom";
import { ServerResult } from "@/lib/types";

export type Data<T> = T;

export function useCRUD<T>({
  initialGet = true,
  url,
  params,
}: {
  initialGet?: boolean;
  url: string;
  params?: Record<string, string>;
}) {
  const [data, setData] = useState<Data<T>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const { account, refresh } = useSession();

  const checkTokenExpired = useCallback(
    // TODO: redesign redoFunction
    (error: string, redoFunction: () => void) => {
      if (error === "Invalid access token") {
        return refresh().then((isRefreshSuccess) => {
          console.log(isRefreshSuccess);
          if (isRefreshSuccess === false) {
            return redirect("/login");
          }
          // isRefreshSuccess && redoFunction();
          return isRefreshSuccess;
        });
      } else {
        setError(error);
        toast({
          title: "Error",
          description: error,
        });
      }
    },
    [refresh, toast]
  );

  const get = useCallback(() => {
    setLoading(true);
    fetch(
      `${BASE_URL}${url}${params ? "?" + new URLSearchParams(params) : ""}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${account?.accessToken}`,
        },
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then(({ error, data }: ServerResult<Data<T>[]>) => {
        setLoading(false);
        if (error) {
          checkTokenExpired(error, () => get());
          return;
        }
        setData(data);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
      });
  }, [account?.accessToken, checkTokenExpired, params, toast, url]);

  function create(dataToInsert: Omit<T, "id">, shouldRefresh = true) {
    setLoading(true);
    fetch(`${BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${account?.accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(dataToInsert),
    })
      .then((res) => res.json())
      .then(({ error }: ServerResult<Data<T>>) => {
        setLoading(false);
        if (error) {
          checkTokenExpired(error, () => create(dataToInsert));
          return;
        }
        // update data with matching id
        // setData((prevData) => {
        //   if (prevData && data?.id) {
        //     prevData.findIndex((item) => item.id === data.id) !== -1 &&
        //       prevData.splice(
        //         prevData.findIndex((item) => item.id === data.id),
        //         1,
        //         data as Data<T>
        //       );
        //   }
        //   return prevData;
        // });
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

  function update(id: string, data: Partial<T>, shouldRefresh = true) {
    setLoading(true);
    fetch(
      `${BASE_URL}${url}/${id}${
        params ? "?" + new URLSearchParams(params) : ""
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${account?.accessToken}`,
        },
        method: "PATCH",
        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then(({ error }: ServerResult<Data<unknown>>) => {
        setLoading(false);
        if (error) {
          checkTokenExpired(error, () => update(id, data, shouldRefresh));
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

  function remove(id: string, shouldRefresh = true) {
    setLoading(true);
    fetch(`${BASE_URL}${url}/${id}`, {
      headers: {
        Authorization: `Bearer ${account?.accessToken}`,
      },
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data: { error: string; data: unknown }) => {
        setLoading(false);
        if (data.error) {
          checkTokenExpired(data.error, () => remove(id, shouldRefresh));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error, loading, create, update, remove, get };
}

export function useServerAction() {
  const { toast } = useToast();
  const { account, refresh } = useSession();

  const checkTokenExpired = useCallback(
    (error: string, redoFunction: () => void) => {
      if (error === "Invalid access token") {
        return refresh().then((successRefresh) => {
          if (!successRefresh) {
            successRefresh === false && redirect("/login");
          }
          successRefresh && redoFunction();
          return successRefresh;
        });
      } else {
        toast({
          title: "Error",
          description: error,
        });
      }
      return Promise.resolve(false);
    },
    [refresh, toast]
  );

  const serverAction = useCallback(
    <T,>(
      url: RequestInfo | URL,
      methodAndData?: {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        data?: object;
      }
    ) =>
      fetch(`${BASE_URL}${url}`, {
        headers: {
          "Content-Type": "application/json",
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
            checkTokenExpired(data.error, () =>
              serverAction(url, methodAndData)
            );
            return {
              error,
              data: null,
            };
          }
          return {
            error: null,
            data: data as T,
          };
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err.message,
          });
          console.log(err);
          return {
            error: err.message,
            data: null,
          };
        }),
    [account?.accessToken, checkTokenExpired, toast]
  );
  return serverAction;
}

export function useWebSocket<T>(url: string) {
  //request token from tokenUrl
  const [lastJsonMessage, setLastJsonMessage] = useState<T | null>(null);
  const [lastMessage, setLastMessage] = useState<MessageEvent["data"] | null>(
    null
  );
  const [ws, setWs] = useState<WebSocket | null>(null);
  const serverAction = useServerAction();

  useEffect(() => {
    serverAction<{
      token: string;
    }>("/waclient/connect").then(({ data }) => {
      if (data) {
        const ws = new WebSocket(
          `${location.protocol === "https:" ? "wss://" : "ws://"}${
            location.hostname
          }:3000${BASE_URL}${url}?token=${data.token}`
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // useEffect(() => {
  //   if (data) {
  //     const ws = new WebSocket(
  //       `${BASE_URL.replace(/^http/, "ws")}${url}?token=${data.token}`
  //     );
  //     setWs(ws);
  //     ws.onmessage = (e) => {
  //       setLastMessage(e.data);
  //       const json = isStringJson(e.data);
  //       json && setLastJsonMessage(json);
  //     };
  //     ws.onclose = (e) => {
  //       console.log(e);
  //     };
  //     ws.onerror = (e) => {
  //       console.log(e);
  //     };
  //   }
  // }, [data, url]);

  function sendMessage(message: string) {
    if (ws) {
      ws.send(message);
    }
  }
  return { lastJsonMessage, lastMessage, sendMessage };
}
