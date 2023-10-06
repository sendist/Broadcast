import { createContext, useEffect, useReducer } from "react";
import { BASE_URL } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Account, ServerResult } from "@/lib/types";
import { isStringJson } from "@/lib/utils";

// account context

interface State {
  account?: Account;
  error?: string;
  loading: boolean;
}

type Action =
  | { type: "loading" }
  | { type: "success"; payload: Account }
  | { type: "error"; payload: string }
  | { type: "reset" };

const AccountContext = createContext<
  State & {
    login: (username: string, password: string) => Promise<void>;
    refresh: () => Promise<Account | false>;
    logout: () => void;
  }
>({
  account: undefined,
  loading: true,
  error: undefined,
  login: () => Promise.resolve(),
  refresh: () => Promise.resolve(false),
  logout: () => {},
});

const initialState: State = {
  error: undefined,
  account: isStringJson(localStorage.getItem("account")) || undefined,
  loading: true,
};

type AccountProviderProps = {
  children: React.ReactNode;
};

const AccountProvider = ({ children }: AccountProviderProps) => {
  const fetchReducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "loading":
        return { ...initialState };
      case "success":
        return { ...initialState, account: action.payload, loading: false };
      case "error":
        return { ...initialState, error: action.payload, loading: false };
      case "reset":
        return { ...initialState, loading: false };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  const { toast } = useToast();
  const navigate = useNavigate();

  function login(username: string, password: string) {
    dispatch({ type: "loading" });

    return fetch(BASE_URL + "/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then(({ error, data }: ServerResult<Account>) => {
        if (error) {
          dispatch({ type: "error", payload: error });
          toast({
            title: "Error",
            description: error,
          });
        } else if (data) {
          dispatch({ type: "success", payload: data });
          navigate("/");
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

  function refresh(): Promise<false | Account> {
    return fetch(BASE_URL + "/auth/refresh")
      .then((res) => {
        if (res.status === 401) {
          dispatch({ type: "error", payload: "Session expired" });
          toast({
            title: "Please re-login",
            description: "Session expired",
          });
          return false;
        } else {
          return res.json().then(({ data }: ServerResult<Account>) => {
            if (data) {
              dispatch({ type: "success", payload: data });
              return data;
            }
            return false;
          });
        }
      })
      .catch((err) => {
        dispatch({ type: "error", payload: err.message });
        toast({
          title: "Error",
          description: err.message,
        });
        console.error(err);
        return false;
      });
  }

  function logout() {
    dispatch({ type: "loading" });
    return fetch(BASE_URL + "/auth/logout")
      .then((res) => res.json())
      .then(({ error }: ServerResult<unknown>) => {
        if (error) {
          toast({
            title: "Error",
            description: error,
          });
          return;
        }
        localStorage.removeItem("account");
        dispatch({ type: "reset" });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
        });
        console.error(err);
      });
  }

  useEffect(() => {
    // save or delete account from localStorage
    if (state.account) {
      localStorage.setItem("account", JSON.stringify(state.account));
    } else {
      localStorage.removeItem("account");
    }
  }, [state.account]);

  useEffect(() => {
    if (localStorage.getItem("account")) {
      refresh();
    } else {
      dispatch({ type: "reset" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccountContext.Provider value={{ ...state, login, refresh, logout }}>
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountProvider };
