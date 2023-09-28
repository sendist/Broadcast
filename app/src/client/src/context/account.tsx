import { createContext, useEffect, useState } from "react";
import { BASE_URL } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Account, ServerResult } from "@/lib/types";

// account context

const AccountContext = createContext<{
  account: Account | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  refresh: () => Promise<boolean | null>;
  logout: () => void;
}>({
  account: null,
  loading: true,
  error: null,
  login: () => Promise.resolve(),
  refresh: () => Promise.resolve(false),
  logout: () => {},
});

const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(
    localStorage.getItem("account")
      ? JSON.parse(localStorage.getItem("account")!)
      : null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  function login(username: string, password: string) {
    setLoading(true);
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
          setError(error);
          toast({
            title: "Error",
            description: error,
          });
        }
        setError(null);
        setAccount(data);
        navigate("/");
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  function refresh() {
    setLoading(true);
    return fetch(BASE_URL + "/auth/refresh")
      .then((res) => res.json())
      .then(({ data, error }: ServerResult<Account>) => {
        if (error && error === "Invalid refresh token") {
          setError(error);
          setAccount(null);
          toast({
            title: "Error",
            description: error,
          });
          navigate("/login");
          return false;
        }
        setError(null);
        setAccount(data);
        return true;
      })
      .catch((err) => {
        setError(err.message);
        setAccount(null);
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
        return null;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function logout() {
    setLoading(true);
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
        setAccount(null);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // save or delete account from localStorage
    if (account) {
      localStorage.setItem("account", JSON.stringify(account));
    } else {
      localStorage.removeItem("account");
    }
  }, [account]);

  useEffect(() => {
    refresh().then((res) => {
      if (res === false) {
        navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccountContext.Provider
      value={{ account, loading, error, login, refresh, logout }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountProvider };
