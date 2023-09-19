import { createContext, useState } from "react";

// account context
type Account = {
  id: number;
  username: string;
  token: string;
  refreshToken: string;
};

const AccountContext = createContext<{
  account: Account | null;
  loading: boolean;
  login: (username: string, password: string) => void;
  refreshSession: () => void;
}>({
  account: null,
  loading: true,
  login: () => {},
  refreshSession: () => {},
});

const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  function login(username: string, password: string) {
    setLoading(true);
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAccount(data);
        setLoading(false);
      });
  }

  function refreshSession() {
    setLoading(true);
    fetch("/api/refresh-session")
      .then((res) => res.json())
      .then((data) => {
        setAccount(data);
        setLoading(false);
      });
  }

  return (
    <AccountContext.Provider
      value={{ account, loading, login, refreshSession }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountProvider };
