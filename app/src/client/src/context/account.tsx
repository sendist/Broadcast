import { createContext, useEffect, useState } from "react";
import { BASE_URL } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";

// account context
export type Account = {
  id: number;
  username: string;
  accessToken: string;
};

const AccountContext = createContext<{
  account: Account | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  refresh: () => Promise<boolean>;
  logout: () => void;
}>({
  account: null,
  loading: true,
  error: null,
  login: () => Promise.resolve(true),
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

  function login(username: string, password: string) {
    setLoading(true);
    return fetch(BASE_URL + "/api/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data: { error: string; data: Account }) => {
        setLoading(false);
        if (data.error) {
          setError(data.error);
          toast({
            title: "Error",
            description: data.error,
          });
          return false;
        }
        setError(null);
        setAccount(data.data);
        return true;
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
        return false;
      });
  }

  function refresh() {
    setLoading(true);
    return fetch(BASE_URL + "/api/auth/refresh")
      .then((res) => res.json())
      .then((data: { error: string; data: Account }) => {
        setLoading(false);
        if (data.error) {
          setError(data.error);
          setAccount(null);
          toast({
            title: "Error",
            description: data.error,
          });
          return false;
        }
        setError(null);
        setAccount(data.data);
        return true;
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
        setAccount(null);
        toast({
          title: "Error",
          description: err.message,
        });
        console.log(err);
        return false;
      });
  }

  function logout() {
    setAccount(null);
  }

  useEffect(() => {
    // save or delete account from localStorage
    if (account) {
      localStorage.setItem("account", JSON.stringify(account));
    } else {
      localStorage.removeItem("account");
    }
  }, [account]);

  return (
    <AccountContext.Provider
      value={{ account, loading, error, login, refresh, logout }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountProvider };
