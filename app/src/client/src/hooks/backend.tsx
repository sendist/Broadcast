import { BASE_URL } from "@/lib/constants";
import { useEffect, useReducer, useRef, useState } from "react";
import { useApiFetch } from "./fetch";
import { isDev, isStringJson } from "@/lib/utils";

interface State<T> {
  data?: T[];
  error?: string;
  loading: boolean;
}

type Action<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T[] }
  | { type: "error"; payload: string };

type useCRUDType = {
  initialGet?: boolean;
  url: string;
  params?: Record<string, string>;
};

export function useCRUD<T>({ initialGet = true, url, params }: useCRUDType) {
  const cancelRequest = useRef<boolean>(false);
  const httpCall = useApiFetch();

  const initialState: State<T> = {
    data: undefined,
    error: undefined,
    loading: true,
  };

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "loading":
        return { ...initialState };
      case "fetched":
        return { ...initialState, data: action.payload, loading: false };
      case "error":
        return { ...initialState, error: action.payload, loading: false };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);
  const request = async ({
    url,
    options,
    shouldRefresh,
    shouldDispatch = false,
  }: {
    url: string;
    options: RequestInit;
    shouldRefresh: boolean;
    shouldDispatch?: boolean;
    newToken?: string;
  }) => {
    const result = await httpCall({
      url,
      options,
    });
    if (result?.error) {
      shouldDispatch && dispatch({ type: "error", payload: result.error });
    } else if (result?.data) {
      shouldRefresh && (await get());
      shouldDispatch &&
        dispatch({ type: "fetched", payload: result.data as T[] });
    }
    return result as
      | { data: T | T[]; error: null }
      | { error: string; data: null };
  };

  const get = () =>
    request({
      url: `${BASE_URL}${url}${
        params ? "?" + new URLSearchParams(params) : ""
      }`,
      options: {
        method: "GET",
      },
      shouldRefresh: false,
      shouldDispatch: true,
    });

  const create = (dataToInsert: Omit<T, "id">, shouldRefresh = true) =>
    request({
      url: `${BASE_URL}${url}`,
      options: {
        method: "POST",
        body: JSON.stringify(dataToInsert),
      },
      shouldRefresh,
    });

  const update = (id: string, newData: Partial<T>, shouldRefresh = true) =>
    request({
      url: `${BASE_URL}${url}/${id}`,
      options: {
        method: "PATCH",
        body: JSON.stringify(newData),
      },
      shouldRefresh,
    });

  const remove = (id: string, shouldRefresh = true) =>
    request({
      url: `${BASE_URL}${url}/${id}`,
      options: {
        method: "DELETE",
      },
      shouldRefresh,
    });

  useEffect(() => {
    // Do nothing if the url is not given
    cancelRequest.current = false;
    if (initialGet) {
      get();
    }

    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted
    return () => {
      cancelRequest.current = true;
    };
  }, []);

  return { ...state, get, create, update, remove };
}

// WEBSOCKET
let websocket: WebSocket | null = null;

function stopWebSocket() {
  websocket?.close();
  websocket = null;
}

export function useWebSocket<T>(url: string, getTokenURL: string) {
  const httpCall = useApiFetch();
  const [lastJsonMessage, setLastJsonMessage] = useState<T | null>(null);
  const [lastMessage, setLastMessage] = useState<MessageEvent["data"] | null>(
    null
  );

  useEffect(() => {
    httpCall<{
      token: string;
    }>({ url: `${BASE_URL}${getTokenURL}` }).then((res) => {
      if (res?.data) {
        stopWebSocket();
        const ws = new WebSocket(
          isDev()
            ? `${location.protocol === "https:" ? "wss://" : "ws://"}${
                location.hostname
              }:3000${BASE_URL}${url}?token=${res.data.token}`
            : `${location.protocol === "https:" ? "wss://" : "ws://"}${
                location.host
              }${BASE_URL}${url}?token=${res.data.token}`
        );
        websocket = ws;
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

    return () => {
      stopWebSocket();
    };
  }, []);

  function sendMessage(message: string) {
    if (websocket) {
      websocket.send(message);
    }
  }
  return { lastJsonMessage, lastMessage, sendMessage };
}
