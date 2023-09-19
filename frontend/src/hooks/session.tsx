import { useEffect, useState } from "react";

type Account = {
  id: number;
  username: string;
  token: string;
  refreshToken: string;
};

const useSession = () => {
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
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const { data } = await fetch("/api/account").then((res) => res.json());
        setAccount(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  return { account, loading, login };
};

export default useSession;
